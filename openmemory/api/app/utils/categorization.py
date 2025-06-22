import logging
import json
from typing import List

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
from tenacity import retry, stop_after_attempt, wait_exponential
from app.utils.prompts import MEMORY_CATEGORIZATION_PROMPT

load_dotenv()
openai_client = OpenAI()


class MemoryCategories(BaseModel):
    categories: List[str]


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=15))
def get_categories_for_memory(memory: str) -> List[str]:
    completion = None  # Initialize completion to None
    try:
        messages = [
            {"role": "system", "content": MEMORY_CATEGORIZATION_PROMPT},
            {"role": "user", "content": memory}
        ]

        completion = openai_client.chat.completions.create(
            model="gpt-4o-mini",  # This will be overridden by your config
            messages=messages,
            temperature=0,
            response_format={"type": "json_object"},
        )

        response_content = completion.choices[0].message.content
        # The response from the LLM is a JSON string, so we need to parse it.
        parsed_data = json.loads(response_content)
        
        # Now, validate with Pydantic
        parsed = MemoryCategories.model_validate(parsed_data)
        
        return [cat.strip().lower() for cat in parsed.categories]

    except Exception as e:
        logging.error(f"[ERROR] Failed to get categories: {e}")
        try:
            if completion:
                logging.debug(f"[DEBUG] Raw response: {completion.choices[0].message.content}")
        except Exception as debug_e:
            logging.debug(f"[DEBUG] Could not extract raw response: {debug_e}")
        raise

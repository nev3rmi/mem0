import logging
import json
from typing import List
import os

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
from tenacity import retry, stop_after_attempt, wait_exponential
from app.utils.prompts import MEMORY_CATEGORIZATION_PROMPT

load_dotenv()
# openai_client = OpenAI() # This will be initialized inside the function


class MemoryCategories(BaseModel):
    categories: List[str]


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=15))
def get_categories_for_memory(memory: str) -> List[str]:
    """
    Get categories for a memory using an LLM.

    This function initializes the OpenAI client, checking for OpenRouter configuration first,
    and then makes a request to the LLM to categorize the memory.

    Args:
        memory: The memory content to categorize.

    Returns:
        A list of category strings.
    """
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if api_key:
        client = OpenAI(
            api_key=api_key,
            base_url=os.environ.get("OPENROUTER_API_BASE", "https://openrouter.ai/api/v1"),
        )
    else:
        # If OPENROUTER_API_KEY is not set, it will use OPENAI_API_KEY by default
        client = OpenAI()
        
    completion = None  # Initialize completion to None
    try:
        messages = [
            {"role": "system", "content": MEMORY_CATEGORIZATION_PROMPT},
            {"role": "user", "content": memory}
        ]

        completion = client.chat.completions.create(
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

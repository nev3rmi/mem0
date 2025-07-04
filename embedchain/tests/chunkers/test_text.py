# ruff: noqa: E501

from embedchain.chunkers.text import TextChunker
from embedchain.config import ChunkerConfig
from embedchain.models.data_type import DataType


class TestTextChunker:
    def test_chunks_without_app_id(self):
        """
        Test the chunks generated by TextChunker.
        """
        chunker_config = ChunkerConfig(chunk_size=10, chunk_overlap=0, length_function=len, min_chunk_size=0)
        chunker = TextChunker(config=chunker_config)
        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        # Data type must be set manually in the test
        chunker.set_data_type(DataType.TEXT)
        result = chunker.create_chunks(MockLoader(), text, chunker_config)
        documents = result["documents"]
        assert len(documents) > 5

    def test_chunks_with_app_id(self):
        """
        Test the chunks generated by TextChunker with app_id
        """
        chunker_config = ChunkerConfig(chunk_size=10, chunk_overlap=0, length_function=len, min_chunk_size=0)
        chunker = TextChunker(config=chunker_config)
        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        chunker.set_data_type(DataType.TEXT)
        result = chunker.create_chunks(MockLoader(), text, chunker_config)
        documents = result["documents"]
        assert len(documents) > 5

    def test_big_chunksize(self):
        """
        Test that if an infinitely high chunk size is used, only one chunk is returned.
        """
        chunker_config = ChunkerConfig(chunk_size=9999999999, chunk_overlap=0, length_function=len, min_chunk_size=0)
        chunker = TextChunker(config=chunker_config)
        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        # Data type must be set manually in the test
        chunker.set_data_type(DataType.TEXT)
        result = chunker.create_chunks(MockLoader(), text, chunker_config)
        documents = result["documents"]
        assert len(documents) == 1

    def test_small_chunksize(self):
        """
        Test that if a chunk size of one is used, every character is a chunk.
        """
        chunker_config = ChunkerConfig(chunk_size=1, chunk_overlap=0, length_function=len, min_chunk_size=0)
        chunker = TextChunker(config=chunker_config)
        # We can't test with lorem ipsum because chunks are deduped, so would be recurring characters.
        text = """0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\x0b\x0c"""
        # Data type must be set manually in the test
        chunker.set_data_type(DataType.TEXT)
        result = chunker.create_chunks(MockLoader(), text, chunker_config)
        documents = result["documents"]
        assert len(documents) == len(text)

    def test_word_count(self):
        chunker_config = ChunkerConfig(chunk_size=1, chunk_overlap=0, length_function=len, min_chunk_size=0)
        chunker = TextChunker(config=chunker_config)
        chunker.set_data_type(DataType.TEXT)

        document = ["ab cd", "ef gh"]
        result = chunker.get_word_count(document)
        assert result == 4


class MockLoader:
    @staticmethod
    def load_data(src) -> dict:
        """
        Mock loader that returns a list of data dictionaries.
        Adjust this method to return different data for testing.
        """
        return {
            "doc_id": "123",
            "data": [
                {
                    "content": src,
                    "meta_data": {"url": "none"},
                }
            ],
        }

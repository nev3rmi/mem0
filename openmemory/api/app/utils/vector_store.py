import logging
from qdrant_client import QdrantClient

def _get_qdrant_config(config):
    vector_store_config = config.get("mem0", {}).get("vector_store", {})
    if vector_store_config and vector_store_config.get("provider") == "qdrant":
        return vector_store_config.get("config")
    return None

def wipe_qdrant_collection(qdrant_config):
    """
    Deletes the Qdrant collection to clear all data.
    """
    if not qdrant_config:
        logging.info("Not a Qdrant vector store, skipping wipe.")
        return

    collection_name = qdrant_config.get("collection_name")
    host = qdrant_config.get("host")
    port = qdrant_config.get("port")

    if not all([collection_name, host, port]):
        logging.error("Qdrant config is missing collection_name, host, or port.")
        return

    try:
        client = QdrantClient(host=host, port=port)
        logging.info(f"Attempting to delete Qdrant collection: {collection_name}")
        client.delete_collection(collection_name=collection_name)
        logging.info(f"Collection '{collection_name}' deleted successfully.")
    except Exception as e:
        # It's often okay if the collection doesn't exist.
        logging.warning(f"Could not delete collection '{collection_name}' (it might not exist): {e}")

def wipe_vector_store_if_embedder_changed(old_config, new_config):
    """
    Compares old and new embedder configurations and wipes the vector store if they differ.
    """
    old_embedder = old_config.get("mem0", {}).get("embedder")
    new_embedder = new_config.get("mem0", {}).get("embedder")

    if old_embedder != new_embedder:
        logging.info("Embedder configuration changed. Wiping vector store.")
        qdrant_config = _get_qdrant_config(new_config)
        if qdrant_config:
            wipe_qdrant_collection(qdrant_config)
    else:
        logging.info("Embedder configuration has not changed. Vector store will not be wiped.") 
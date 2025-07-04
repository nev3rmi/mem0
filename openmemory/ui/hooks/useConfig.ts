import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import {
  setConfigLoading,
  setConfigSuccess,
  setConfigError,
  updateLLM,
  updateEmbedder,
  updateVectorStore,
  LLMProvider,
  EmbedderProvider,
  Mem0Config,
  OpenMemoryConfig,
  VectorStoreProvider,
} from '@/store/configSlice';
import { toast } from 'react-hot-toast';

interface UseConfigApiReturn {
  fetchConfig: () => Promise<void>;
  saveConfig: (config: { openmemory?: OpenMemoryConfig; mem0: Mem0Config }) => Promise<void>;
  saveLLMConfig: (llmConfig: LLMProvider) => Promise<void>;
  saveEmbedderConfig: (embedderConfig: EmbedderProvider) => Promise<void>;
  saveVectorStoreConfig: (vectorStoreConfig: VectorStoreProvider) => Promise<void>;
  resetConfig: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useConfig = (): UseConfigApiReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8765";
  
  const fetchConfig = async () => {
    setIsLoading(true);
    dispatch(setConfigLoading());
    
    try {
      const response = await axios.get(`${URL}/api/v1/config`);
      dispatch(setConfigSuccess(response.data));
      setIsLoading(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch configuration';
      dispatch(setConfigError(errorMessage));
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const saveConfig = async (config: { openmemory?: OpenMemoryConfig; mem0: Mem0Config }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${URL}/api/v1/config`, config);
      dispatch(setConfigSuccess(response.data));
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to save configuration';
      dispatch(setConfigError(errorMessage));
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const resetConfig = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${URL}/api/v1/config/reset`);
      dispatch(setConfigSuccess(response.data));
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to reset configuration';
      dispatch(setConfigError(errorMessage));
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const saveLLMConfig = async (llmConfig: LLMProvider) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${URL}/api/v1/config/mem0/llm`, llmConfig);
      dispatch(updateLLM(response.data));
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to save LLM configuration';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const saveEmbedderConfig = async (embedderConfig: EmbedderProvider) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${URL}/api/v1/config/mem0/embedder`, embedderConfig);
      dispatch(updateEmbedder(response.data));
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to save Embedder configuration';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const saveVectorStoreConfig = async (
    vectorStoreConfig: VectorStoreProvider
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${URL}/api/v1/config/mem0/vector_store`, vectorStoreConfig);
      dispatch(updateVectorStore(response.data));
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to save Vector Store configuration';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    fetchConfig,
    saveConfig,
    saveLLMConfig,
    saveEmbedderConfig,
    saveVectorStoreConfig,
    resetConfig,
    isLoading,
    error
  };
}; 
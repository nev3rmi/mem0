"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { Switch } from "./ui/switch"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion"

interface FormViewProps {
  settings: any
  onChange: (settings: any) => void
}

export function FormView({ settings, onChange }: FormViewProps) {
  const [showLlmAdvanced, setShowLlmAdvanced] = useState(false)
  const [showLlmApiKey, setShowLlmApiKey] = useState(false)
  const [showEmbedderApiKey, setShowEmbedderApiKey] = useState(false)

  const handleOpenMemoryChange = (key: string, value: any) => {
    onChange({
      ...settings,
      openmemory: {
        ...settings.openmemory,
        [key]: value,
      },
    })
  }

  const handleLlmProviderChange = (value: string) => {
    // Reset config when provider changes, but keep essential fields
    const currentConfig = settings.mem0?.llm?.config || {};
    const newConfig = {
      model: currentConfig.model || "",
      api_key: currentConfig.api_key || "",
      temperature: currentConfig.temperature ?? 0.7, // Use existing or a default
      max_tokens: currentConfig.max_tokens ?? 2000, // Use existing or a default
    };

    onChange({
      ...settings,
      mem0: {
        ...settings.mem0,
        llm: {
          provider: value,
          config: newConfig,
        },
      },
    });
  }

  const handleLlmConfigChange = (key: string, value: any) => {
    onChange({
      ...settings,
      mem0: {
        ...settings.mem0,
        llm: {
          ...settings.mem0.llm,
          config: {
            ...settings.mem0.llm.config,
            [key]: value,
          },
        },
      },
    })
  }

  const handleEmbedderProviderChange = (value: string) => {
    // Reset config for the new provider, keeping the model name
    const currentConfig = settings.mem0?.embedder?.config || {};
    const newConfig = {
      model: currentConfig.model || "",
      api_key: currentConfig.api_key || "",
    };
    onChange({
      ...settings,
      mem0: {
        ...settings.mem0,
        embedder: {
          provider: value,
          config: newConfig,
        },
      },
    });
  }

  const handleEmbedderConfigChange = (key: string, value: any) => {
    onChange({
      ...settings,
      mem0: {
        ...settings.mem0,
        embedder: {
          ...settings.mem0.embedder,
          config: {
            ...settings.mem0.embedder.config,
            [key]: value,
          },
        },
      },
    })
  }

  const handleVectorStoreProviderChange = (value: string) => {
    const newConfig = {
      ...settings,
      mem0: {
        ...settings.mem0,
        vector_store: {
          ...settings.mem0.vector_store,
          provider: value,
          config: {}, // Reset config when provider changes
        },
      },
    };
    onChange(newConfig);
  };

  const handleVectorStoreConfigChange = (key: string, value: any) => {
    const newConfig = {
      ...settings,
      mem0: {
        ...settings.mem0,
        vector_store: {
          ...settings.mem0.vector_store,
          config: {
            ...settings.mem0.vector_store?.config,
            [key]: value,
          },
        },
      },
    };
    onChange(newConfig);
  };

  const needsLlmApiKey = settings.mem0?.llm?.provider?.toLowerCase() !== "ollama"
  const needsEmbedderApiKey = settings.mem0?.embedder?.provider?.toLowerCase() !== "ollama"
  const isLlmOllama = settings.mem0?.llm?.provider?.toLowerCase() === "ollama"
  const isLlmOpenAI = settings.mem0?.llm?.provider?.toLowerCase() === "openai"
  const isLlmOpenRouter = settings.mem0?.llm?.provider?.toLowerCase() === "openrouter"
  const isEmbedderOllama = settings.mem0?.embedder?.provider?.toLowerCase() === "ollama"
  const isEmbedderOpenAI = settings.mem0?.embedder?.provider?.toLowerCase() === "openai"

  const LLM_PROVIDERS = [
    "openai",
    // "openrouter",
    "anthropic",
    "azure_openai",
    "ollama",
    "together",
    "groq",
    "litellm",
    "mistral_ai",
    "google_ai",
    "aws_bedrock",
    "gemini",
    "deepseek",
    "xai",
    "lmstudio",
    "langchain",
  ]

  const EMBEDDER_PROVIDERS = [
    "openai",
    "azure_openai",
    "ollama",
    "huggingface",
    "vertexai",
    "gemini",
    "lmstudio",
    "together",
    "langchain",
    "aws_bedrock",
  ]

  const vectorStoreProvider = settings.mem0.vector_store?.provider

  return (
    <div className="space-y-8">
      {/* OpenMemory Settings */}
      <Card>
        <CardHeader>
          <CardTitle>OpenMemory Settings</CardTitle>
          <CardDescription>Configure your OpenMemory instance settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="custom-instructions">Custom Instructions</Label>
            <Textarea
              id="custom-instructions"
              placeholder="Enter custom instructions for memory management..."
              value={settings.openmemory?.custom_instructions || ""}
              onChange={(e) => handleOpenMemoryChange("custom_instructions", e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Custom instructions that will be used to guide memory processing and fact extraction.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* LLM Settings */}
      <Card>
        <CardHeader>
          <CardTitle>LLM Settings</CardTitle>
          <CardDescription>Configure your Large Language Model provider and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="llm-provider">LLM Provider</Label>
            <Select 
              value={settings.mem0?.llm?.provider || ""}
              onValueChange={handleLlmProviderChange}
            >
              <SelectTrigger id="llm-provider">
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {LLM_PROVIDERS.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider.charAt(0).toUpperCase() + provider.slice(1).replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLlmOpenRouter && (
            <div className="space-y-2">
              <Label htmlFor="llm-openrouter-base-url">OpenRouter Base URL</Label>
              <Input
                id="llm-openrouter-base-url"
                placeholder="e.g., https://openrouter.ai/api/v1"
                value={settings.mem0?.llm?.config?.openrouter_base_url || ""}
                onChange={(e) => handleLlmConfigChange("openrouter_base_url", e.target.value)}
              />
            </div>
          )}

          {isLlmOpenAI && (
            <div className="space-y-2">
              <Label htmlFor="llm-openai-base-url">OpenAI Base URL</Label>
              <Input
                id="llm-openai-base-url"
                placeholder="e.g., https://api.openai.com/v1"
                value={settings.mem0?.llm?.config?.openai_base_url || ""}
                onChange={(e) => handleLlmConfigChange("openai_base_url", e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="llm-model">Model</Label>
            <Input
              id="llm-model"
              placeholder="Enter model name"
              value={settings.mem0?.llm?.config?.model || ""}
              onChange={(e) => handleLlmConfigChange("model", e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch id="llm-advanced-settings" checked={showLlmAdvanced} onCheckedChange={setShowLlmAdvanced} />
            <Label htmlFor="llm-advanced-settings">Show advanced settings</Label>
          </div>

          {showLlmAdvanced && (
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature: {settings.mem0?.llm?.config?.temperature}</Label>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[settings.mem0?.llm?.config?.temperature || 0.7]}
                  onValueChange={(value) => handleLlmConfigChange("temperature", value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  placeholder="2000"
                  value={settings.mem0?.llm?.config?.max_tokens || ""}
                  onChange={(e) => handleLlmConfigChange("max_tokens", Number.parseInt(e.target.value) || "")}
                />
              </div>
            </div>
          )}

          {isLlmOllama && (
            <div className="space-y-2">
              <Label htmlFor="llm-ollama-url">Ollama Base URL</Label>
              <Input
                id="llm-ollama-url"
                placeholder="http://host.docker.internal:11434"
                value={settings.mem0?.llm?.config?.ollama_base_url || ""}
                onChange={(e) => handleLlmConfigChange("ollama_base_url", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to use default: http://host.docker.internal:11434
              </p>
            </div>
          )}

          {needsLlmApiKey && (
            <div className="space-y-2">
              <Label htmlFor="llm-api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="llm-api-key"
                  type={showLlmApiKey ? "text" : "password"}
                  placeholder="env:API_KEY"
                  value={settings.mem0?.llm?.config?.api_key || ""}
                  onChange={(e) => handleLlmConfigChange("api_key", e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowLlmApiKey(!showLlmApiKey)}
                >
                  {showLlmApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use "env:API_KEY" to load from environment variable, or enter directly
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Embedder Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Embedder Settings</CardTitle>
          <CardDescription>Configure your Embedding Model provider and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="embedder-provider">Embedder Provider</Label>
            <Select 
              value={settings.mem0?.embedder?.provider || ""} 
              onValueChange={handleEmbedderProviderChange}
            >
              <SelectTrigger id="embedder-provider">
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {EMBEDDER_PROVIDERS.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider.charAt(0).toUpperCase() + provider.slice(1).replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isEmbedderOpenAI && (
            <div className="space-y-2">
              <Label htmlFor="embedder-openai-base-url">OpenAI Base URL</Label>
              <Input
                id="embedder-openai-base-url"
                placeholder="e.g., https://api.openai.com/v1"
                value={settings.mem0?.embedder?.config?.openai_base_url || ""}
                onChange={(e) => handleEmbedderConfigChange("openai_base_url", e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="embedder-model">Model</Label>
            <Input
              id="embedder-model"
              placeholder="Enter model name"
              value={settings.mem0?.embedder?.config?.model || ""}
              onChange={(e) => handleEmbedderConfigChange("model", e.target.value)}
            />
          </div>

          {isEmbedderOllama && (
            <div className="space-y-2">
              <Label htmlFor="embedder-ollama-url">Ollama Base URL</Label>
              <Input
                id="embedder-ollama-url"
                placeholder="http://host.docker.internal:11434"
                value={settings.mem0?.embedder?.config?.ollama_base_url || ""}
                onChange={(e) => handleEmbedderConfigChange("ollama_base_url", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to use default: http://host.docker.internal:11434
              </p>
            </div>
          )}

          {needsEmbedderApiKey && (
            <div className="space-y-2">
              <Label htmlFor="embedder-api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="embedder-api-key"
                  type={showEmbedderApiKey ? "text" : "password"}
                  placeholder="env:API_KEY"
                  value={settings.mem0?.embedder?.config?.api_key || ""}
                  onChange={(e) => handleEmbedderConfigChange("api_key", e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowEmbedderApiKey(!showEmbedderApiKey)}
                >
                  {showEmbedderApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use "env:API_KEY" to load from environment variable, or enter directly
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vector Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Vector Store</CardTitle>
          <CardDescription>Configure your Vector Store provider and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select value={vectorStoreProvider} onValueChange={handleVectorStoreProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qdrant">Qdrant</SelectItem>
                <SelectItem value="chroma">Chroma</SelectItem>
                <SelectItem value="pgvector">PGVector</SelectItem>
                {/* Add other providers as needed */}
              </SelectContent>
            </Select>
          </div>

          {vectorStoreProvider === 'qdrant' && (
            <>
              <div className="space-y-2">
                <Label>Host</Label>
                <Input
                  value={settings.mem0.vector_store?.config?.host || ''}
                  onChange={(e) => handleVectorStoreConfigChange('host', e.target.value)}
                  placeholder="e.g. localhost or mem0_store"
                />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input
                  type="number"
                  value={settings.mem0.vector_store?.config?.port || ''}
                  onChange={(e) => handleVectorStoreConfigChange('port', parseInt(e.target.value))}
                  placeholder="e.g. 6333"
                />
              </div>
              <div className="space-y-2">
                <Label>Collection Name</Label>
                <Input
                  value={settings.mem0.vector_store?.config?.collection_name || ''}
                  onChange={(e) => handleVectorStoreConfigChange('collection_name', e.target.value)}
                  placeholder="e.g. mem0"
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label>Embedding Dimensions</Label>
            <Input
              type="number"
              placeholder="e.g. 1536"
              value={settings.mem0.vector_store?.config?.embedding_model_dims || ''}
              onChange={(e) => handleVectorStoreConfigChange('embedding_model_dims', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
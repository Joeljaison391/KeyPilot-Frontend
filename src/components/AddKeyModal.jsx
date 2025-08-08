import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Key, 
  Shield, 
  Calendar, 
  Globe, 
  Settings,
  AlertCircle,
  Loader
} from 'lucide-react'
import { apiKeysAPI } from '../services/api'
import toast from 'react-hot-toast'

const AddKeyModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    api_key: '',
    description: '',
    template: '',
    max_requests_per_day: 1000,
    max_requests_per_week: 5000,
    max_tokens_per_day: 100000,
    max_payload_kb: 1000,
    expiry_date: '',
    allowed_origins: [''],
    scopes: ['']
  })
  
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [errors, setErrors] = useState({})

  // Fetch templates on mount
  useEffect(() => {
    if (isOpen) {
      fetchTemplates()
    }
  }, [isOpen])

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true)
    try {
      const response = await apiKeysAPI.getTemplates()
      if (response.success) {
        setTemplates(response.templates)
      }
    } catch (error) {
      toast.error('Failed to load templates')
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setFormData(prev => ({
      ...prev,
      template: template.id,
      description: template.description,
      scopes: template.scopes
    }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.api_key.trim()) {
      newErrors.api_key = 'API key is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.template.trim()) {
      newErrors.template = 'Template is required'
    }
    
    if (formData.max_requests_per_day < 1) {
      newErrors.max_requests_per_day = 'Must be at least 1'
    }
    
    if (formData.max_requests_per_week < formData.max_requests_per_day) {
      newErrors.max_requests_per_week = 'Must be greater than daily limit'
    }

    // Validate scopes
    const validScopes = formData.scopes.filter(scope => scope.trim())
    if (validScopes.length === 0) {
      newErrors.scopes = 'At least one scope is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('keypilot_token')
      
      // Filter out empty origins and scopes
      const cleanedFormData = {
        ...formData,
        token,
        allowed_origins: formData.allowed_origins.filter(origin => origin.trim()),
        scopes: formData.scopes.filter(scope => scope.trim()),
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null
      }

      const response = await apiKeysAPI.addKey(cleanedFormData)
      
      if (response.success) {
        toast.success('🎉 API key added successfully!')
        onSuccess()
        onClose()
        // Reset form
        setFormData({
          api_key: '',
          description: '',
          template: '',
          max_requests_per_day: 1000,
          max_requests_per_week: 5000,
          max_tokens_per_day: 100000,
          max_payload_kb: 1000,
          expiry_date: '',
          allowed_origins: [''],
          scopes: ['']
        })
        setSelectedTemplate(null)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to add API key'
      toast.error(errorMessage)
      
      // Handle semantic conflict
      if (error.response?.status === 409) {
        const details = error.response?.data?.details
        if (details?.similar_templates) {
          toast.error('⚠️ Similar template detected. Please use a different template name.')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Key className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Add New API Key</h2>
                  <p className="text-gray-400 text-sm">Configure your API key with custom limits and settings</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-6">
                  
                  {/* Template Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <Settings className="inline h-4 w-4 mr-2" />
                      Choose Template
                    </label>
                    {isLoadingTemplates ? (
                      <div className="flex items-center justify-center p-8 bg-gray-700/50 rounded-lg">
                        <Loader className="h-6 w-6 animate-spin text-blue-400" />
                        <span className="ml-2 text-gray-400">Loading templates...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => handleTemplateSelect(template)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedTemplate?.id === template.id
                                ? 'border-blue-500 bg-blue-500/20'
                                : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white">{template.name}</h4>
                              <span className="text-xs px-2 py-1 bg-gray-600 text-gray-300 rounded">
                                {template.provider}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{template.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {template.scopes?.slice(0, 3).map((scope) => (
                                <span key={scope} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                                  {scope}
                                </span>
                              ))}
                              {template.scopes?.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-gray-600 text-gray-300 rounded">
                                  +{template.scopes.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.template && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.template}
                      </p>
                    )}
                  </div>

                  {/* API Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Key className="inline h-4 w-4 mr-2" />
                      API Key *
                    </label>
                    <input
                      type="text"
                      name="api_key"
                      value={formData.api_key}
                      onChange={handleInputChange}
                      placeholder="sk-your-actual-api-key-here"
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${
                        errors.api_key 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {errors.api_key && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.api_key}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Describe what this API key will be used for..."
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors resize-none ${
                        errors.description 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Template Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      name="template"
                      value={formData.template}
                      onChange={handleInputChange}
                      placeholder="my-unique-template-name"
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${
                        errors.template 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {errors.template && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.template}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  
                  {/* Rate Limits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <Shield className="inline h-4 w-4 mr-2" />
                      Rate Limits
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Daily Requests</label>
                        <input
                          type="number"
                          name="max_requests_per_day"
                          value={formData.max_requests_per_day}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Weekly Requests</label>
                        <input
                          type="number"
                          name="max_requests_per_week"
                          value={formData.max_requests_per_week}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Daily Tokens</label>
                        <input
                          type="number"
                          name="max_tokens_per_day"
                          value={formData.max_tokens_per_day}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Max Payload (KB)</label>
                        <input
                          type="number"
                          name="max_payload_kb"
                          value={formData.max_payload_kb}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="expiry_date"
                      value={formData.expiry_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Allowed Origins */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Globe className="inline h-4 w-4 mr-2" />
                      Allowed Origins
                    </label>
                    {formData.allowed_origins.map((origin, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="url"
                          value={origin}
                          onChange={(e) => handleArrayChange('allowed_origins', index, e.target.value)}
                          placeholder="https://example.com"
                          className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        {formData.allowed_origins.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('allowed_origins', index)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('allowed_origins')}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      + Add Origin
                    </button>
                  </div>

                  {/* Scopes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Scopes *
                    </label>
                    {formData.scopes.map((scope, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={scope}
                          onChange={(e) => handleArrayChange('scopes', index, e.target.value)}
                          placeholder="text, completion, analysis"
                          className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        {formData.scopes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('scopes', index)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('scopes')}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      + Add Scope
                    </button>
                    {errors.scopes && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.scopes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Adding Key...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Add API Key
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddKeyModal

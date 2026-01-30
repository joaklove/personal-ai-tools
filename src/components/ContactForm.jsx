import React, { useState } from 'react'
import PropTypes from 'prop-types'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // 表单验证
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = '请输入留言内容'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = '留言内容至少需要10个字符'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 清除对应字段的错误信息
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      // 模拟表单提交
      setTimeout(() => {
        console.log('表单提交成功:', formData)
        setIsSubmitting(false)
        setIsSubmitted(true)
        // 重置表单
        setFormData({ name: '', email: '', message: '' })
        // 3秒后重置提交状态
        setTimeout(() => setIsSubmitted(false), 3000)
      }, 1500)
    }
  }

  // 生成mailto链接
  const generateMailtoLink = () => {
    const subject = '来自个人主页的留言'
    const body = `姓名: ${formData.name}\n邮箱: ${formData.email}\n留言: ${formData.message}`
    return `mailto:example@email.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="contact" className="mb-16 sm:mb-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">联系我</h2>
      <div className="card rounded-xl max-w-3xl mx-auto">
        {isSubmitted ? (
          <div className="py-12 text-center">
            <div className="inline-block p-4 bg-green-100 text-green-800 rounded-full mb-4">
              ✅
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">留言提交成功！</h3>
            <p className="text-gray-600 mb-6">感谢你的留言，我会尽快回复你。</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:example@email.com" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                直接发送邮件
              </a>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                再次留言
              </button>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="mb-4 sm:mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入你的姓名" 
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              <div className="mb-4 sm:mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入你的邮箱" 
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="mb-6 sm:mb-8">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">留言</label>
                <textarea 
                  id="message" 
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入你的留言"
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button 
                  type="submit" 
                  className="flex-1 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '提交中...' : '提交留言'}
                </button>
                <a 
                  href={generateMailtoLink()} 
                  className="flex-1 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                >
                  直接发送邮件
                </a>
              </div>
            </form>
            <div className="border-t border-gray-200 p-6 sm:p-8 bg-gray-50 rounded-b-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">其他联系方式</h3>
              <div className="flex flex-col space-y-3">
                <a href="mailto:example@email.com" className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors">
                  <span>📧</span>
                  <span>example@email.com</span>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors">
                  <span>🐱</span>
                  <span>GitHub</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors">
                  <span>💼</span>
                  <span>LinkedIn</span>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors">
                  <span>🐦</span>
                  <span>X (Twitter)</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* 用户反馈 */}
      <div className="mt-16 sm:mt-20">
        <div className="card rounded-xl max-w-3xl mx-auto p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">用户反馈</h3>
          <p className="text-gray-600 mb-8 text-center">如果你对这个AI工具导航站有任何意见或建议，欢迎告诉我们：</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg text-center">
              <div className="text-2xl mb-2">👍</div>
              <div className="font-medium">很有用</div>
            </button>
            <button className="py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg text-center">
              <div className="text-2xl mb-2">😐</div>
              <div className="font-medium">一般</div>
            </button>
            <button className="py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg text-center">
              <div className="text-2xl mb-2">👎</div>
              <div className="font-medium">需要改进</div>
            </button>
          </div>
          <p className="text-gray-500 text-center mt-8">我们会根据你的反馈不断改进这个网站，谢谢你的支持！</p>
        </div>
      </div>
    </section>
  )
}

ContactForm.propTypes = {
  // 可以添加任何需要的props类型定义
}

export default ContactForm
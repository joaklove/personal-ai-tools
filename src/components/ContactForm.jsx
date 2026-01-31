import React, { useState, useEffect } from 'react'
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
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  // 滚动监听，触发入场动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    const element = document.getElementById('contact')
    if (element) observer.observe(element)
    return () => element && observer.unobserve(element)
  }, [])

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
      <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-10 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>联系我</h2>
      
      {/* 左右分栏布局 */}
      <div className={`max-w-5xl mx-auto rounded-2xl shadow-xl overflow-hidden transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
        {isSubmitted ? (
          <div className="py-16 text-center bg-white">
            <div className="inline-block p-4 bg-green-100 text-green-800 rounded-full mb-4">
              ✅
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">留言提交成功！</h3>
            <p className="text-gray-600 mb-6">感谢你的留言，我会尽快回复你。</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
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
          <div className="grid md:grid-cols-3 gap-0">
            {/* 左侧：表单区域 (2/3 宽度) */}
            <div className="md:col-span-2 p-6 sm:p-8 bg-white">
              <form onSubmit={handleSubmit}>
                {/* 姓名和邮箱同一行 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="请输入你的姓名" 
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="请输入你的邮箱" 
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                {/* 留言区域 */}
                <div className="mb-6 sm:mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">留言</label>
                  <textarea 
                    id="message" 
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.message ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="请输入你的留言"
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    aria-label="留言内容"
                  ></textarea>
                  {errors.message && (
                      <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                </div>
                
                {/* 按钮区域 */}
                <div className="flex flex-col sm:flex-row gap-4">
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
            </div>
            
            {/* 右侧：联系方式区域 (1/3 宽度) */}
            <div className="p-6 sm:p-8 bg-blue-900 text-white">
              <h3 className="text-lg font-semibold mb-6">其他联系方式</h3>
              <div className="space-y-5">
                <a href="mailto:example@email.com" className="flex items-center gap-3 text-blue-200 hover:text-white transition-colors pb-3 border-b border-blue-800">
                  <span className="text-xl">📧</span>
                  <div>
                    <div className="text-sm text-blue-300">邮箱</div>
                    <div className="font-medium">example@email.com</div>
                  </div>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-200 hover:text-white transition-colors pb-3 border-b border-blue-800">
                  <span className="text-xl">🐱</span>
                  <div>
                    <div className="text-sm text-blue-300">GitHub</div>
                    <div className="font-medium">GitHub Profile</div>
                  </div>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-200 hover:text-white transition-colors pb-3 border-b border-blue-800">
                  <span className="text-xl">💼</span>
                  <div>
                    <div className="text-sm text-blue-300">LinkedIn</div>
                    <div className="font-medium">LinkedIn Profile</div>
                  </div>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-200 hover:text-white transition-colors">
                  <span className="text-xl">🐦</span>
                  <div>
                    <div className="text-sm text-blue-300">X (Twitter)</div>
                    <div className="font-medium">Twitter Profile</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 用户反馈 - 分段控制器模式 */}
      <div className="mt-12 sm:mt-16">
        <div className={`max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">用户反馈</h3>
          
          {/* 分段控制器 */}
          <div className="max-w-md mx-auto">
            <div className="relative bg-gray-100 rounded-full p-1 mb-6">
              <div className="flex relative z-10">
                {[
                  { id: 'positive', emoji: '👍', text: '很有用' },
                  { id: 'neutral', emoji: '😐', text: '一般' },
                  { id: 'negative', emoji: '👎', text: '需要改进' }
                ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => setSelectedFeedback(option.id)}
                    className="flex-1 py-3 px-4 text-center rounded-full transition-all duration-300 relative"
                  >
                    {selectedFeedback === option.id && (
                      <motion.div
                        layoutId="feedbackSlider"
                        className="absolute inset-0 bg-white rounded-full shadow-sm z-[-1]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className="text-2xl mb-1">{option.emoji}</div>
                    <div className="text-sm font-medium">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 text-center">您的反馈是我们进步的动力 ❤️</p>
        </div>
      </div>
    </section>
  )
}

ContactForm.propTypes = {
  // 可以添加任何需要的props类型定义
}

export default ContactForm
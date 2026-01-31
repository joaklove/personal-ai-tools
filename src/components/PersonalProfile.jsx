import React from 'react'
import { motion } from 'framer-motion'

const PersonalProfile = () => {
  return (
    <section id="personal" className="mb-16 sm:mb-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-10">个人简介</h2>
      <motion.div 
        className="card rounded-xl"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* 左侧：头像和社交链接 */}
          <motion.div 
            className="flex flex-col items-center lg:items-start"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="w-36 sm:w-44 h-36 sm:h-44 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-4xl sm:text-5xl text-white font-bold">ZM</span>
            </motion.div>
            {/* 社交媒体链接 */}
            <div className="flex flex-col space-y-3 w-full lg:w-auto">
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span>🐱</span>
                <span>GitHub</span>
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span>💼</span>
                <span>LinkedIn</span>
              </motion.a>
              <motion.a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span>🐦</span>
                <span>X</span>
              </motion.a>
              <motion.a 
                href="mailto:example@email.com" 
                className="social-link flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span>📧</span>
                <span>Email</span>
              </motion.a>
            </div>
          </motion.div>
          
          {/* 右侧：文字介绍（占据更大空间） */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">张小明</h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6">AI技术爱好者 | 全栈开发者 | UI/UX设计师</p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              热爱AI技术，专注于AI工具的收集和分享，希望通过这个网站帮助更多人发现和使用优质的AI工具。
              拥有多年的Web开发经验，擅长React、JavaScript和UI设计，致力于创造美观实用的数字产品。
              不断探索AI技术的前沿应用，将AI能力融入到日常开发和设计工作中，提高工作效率和创造力。
            </p>
            
            {/* 技能标签 */}
            <div className="flex flex-wrap gap-3 mb-6">
              {['React', 'JavaScript', 'AI技术', 'Web开发', 'UI/UX设计', 'TypeScript', 'Node.js', 'Tailwind CSS'].map((skill, index) => (
                <motion.span 
                  key={skill}
                  className="skill-tag"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 个人成就 */}
      <div className="mt-12 sm:mt-16">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">个人成就</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <motion.div 
            className="card rounded-xl hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -10 }}
          >
            <div className="flex items-start">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-blue-600 font-bold">01</span>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">AI项目开发</h4>
                <p className="text-gray-700">参与开发了多个AI相关项目，积累了丰富的实战经验，包括自然语言处理和计算机视觉应用。</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="card rounded-xl hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -10 }}
          >
            <div className="flex items-start">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-purple-600 font-bold">02</span>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">AI工具收集</h4>
                <p className="text-gray-700">收集整理了大量优质AI工具，为开发者和创作者提供了宝贵资源，帮助他们提升工作效率。</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PersonalProfile
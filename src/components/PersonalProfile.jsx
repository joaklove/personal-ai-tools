import React from 'react'

const PersonalProfile = () => {
  return (
    <section id="personal" className="mb-16 sm:mb-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">个人简介</h2>
      <div className="card rounded-xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 sm:mb-8 md:mb-0 md:mr-8 sm:md:mr-12 shadow-lg">
            <span className="text-4xl sm:text-5xl text-white font-bold">头像</span>
          </div>
          <div className="text-center md:text-left max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">姓名</h3>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">AI技术爱好者 | 全栈开发者 | UI/UX设计师</p>
            <p className="text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              热爱AI技术，专注于AI工具的收集和分享，希望通过这个网站帮助更多人发现和使用优质的AI工具。
              拥有多年的Web开发经验，擅长React、JavaScript和UI设计，致力于创造美观实用的数字产品。
            </p>
            
            {/* 技能标签 */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="skill-tag">React</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">AI技术</span>
              <span className="skill-tag">Web开发</span>
              <span className="skill-tag">UI/UX设计</span>
              <span className="skill-tag">TypeScript</span>
            </div>
            
            {/* 社交媒体链接 */}
            <div className="flex justify-center md:justify-start space-x-4 sm:space-x-6">
              <a href="#" className="social-link">GitHub</a>
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">X</a>
              <a href="#" className="social-link">Email</a>
            </div>
          </div>
        </div>
      </div>

      {/* 个人成就 */}
      <div className="mt-10 sm:mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">个人成就</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="card rounded-xl hover:shadow-lg transition-all duration-300">
            <div className="flex items-start">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span className="text-blue-600 font-bold">01</span>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">AI项目开发</h4>
                <p className="text-gray-700">参与开发了多个AI相关项目，积累了丰富的实战经验，包括自然语言处理和计算机视觉应用。</p>
              </div>
            </div>
          </div>
          <div className="card rounded-xl hover:shadow-lg transition-all duration-300">
            <div className="flex items-start">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span className="text-purple-600 font-bold">02</span>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">AI工具收集</h4>
                <p className="text-gray-700">收集整理了大量优质AI工具，为开发者和创作者提供了宝贵资源，帮助他们提升工作效率。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PersonalProfile
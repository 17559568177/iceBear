# ice-Bear 企业大脑

## 技术栈 React18 + TypeScript + Vite + zustand + antdv5 + less

## 使用说明

### 在本机直接运行

1.进入根目录执行`pnpm i`命令安装依赖；

2.启动命令`pnpm dev`，启动后会自动跳转页面，
  开发者模式下采用code-inspector，浏览器页面内win按住ctrl+alt+鼠标点击会自动跳转vscode代码部分，mac参考[code-inspector](https://github.com/zh-lx/code-inspector)；

3.构建命令`pnpm build`

### 在 Docker 中运行

1. 在根目录下，执行 `docker build -t <IMAGE_NAME> .`
2. image 构建完毕后，执行 `docker run -p 5000:5000 <CONTAINER_NAME>`

## 开发规范说明

0.***布局统一采用antd的Layout布局方式，content中采用flex布局；

1.复杂组件或计算代价大于O^2应被memo | useMemo | useCallback优化；

2.状态管理采用zuStand，复杂导出应采用createSelector优化；

3.Css采用Less，全局配置颜色、文字大小等，配置在@\src\assets\styles\variable.less下，markdown规范在同级目录；

4.项目采用antdv5，局部antd修改采用:global()，主题色应配置theme下，以便后期国际化和切换主题需求；

5.路由应采用动态导入，后端鉴权方案，配置在@\src\routes\settings.tsx；

6.项目采用axios交互，二次封装在@\src\service\index.ts下,已经进行防抖处理；

7.交互应采用防抖处理、动画应将onChange和onChangeComplete分开优化；

8.整体应采用flex布局，边距应采用px，尽量不使用动态的，以便未来兼容跨端和避免跨端样式问题；

9.tsConfig和.eslintrc作为build和dev模式下的规范，.prettierrc做格式化配置；

10.开发采用git管理，新建分支开发，commit符合cz-customizable规范，以便后期cicd流程；

/* 封装本地存储 模块 */

/* 存储数据
      const obj = {
        anme: 'jhon',
      };
      console.log(typeof obj); // object */
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}
/* 获取数据  强 太强了 */

export const getItem = key => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}
/* 删除数据 */
export const removeItem = key => {
  window.localStorage.removeItem(key)
}

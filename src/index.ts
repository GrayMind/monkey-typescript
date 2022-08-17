console.log("ddd")
function a() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000);
  })
}

a().then(() => {
  console.log('aaa')
})
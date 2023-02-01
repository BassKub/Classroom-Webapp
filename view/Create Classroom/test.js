function generateClassCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
  
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return code;
  }
  
  const classCode = generateClassCode();
  document.querySelector('#classCode').textContent = classCode;
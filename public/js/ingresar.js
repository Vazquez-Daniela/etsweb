const form = document.getElementById('registroForm');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');

form.addEventListener('submit', function (e) {
  const password = passwordInput.value;

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[$@#%&/*]/.test(password);
  const hasMinLength = password.length >= 8;

  // Mostrar nivel de seguridad
  let strength = 0;
  if (hasLowercase) strength++;
  if (hasUppercase) strength++;
  if (hasNumber) strength++;
  if (hasSpecialChar) strength++;
  if (hasMinLength) strength++;

  const strengthMessages = [
    { text: 'Muy Débil', color: '#ff0000' },
    { text: 'Débil', color: '#ff6C00' },
    { text: 'Media', color: '#ffe000' },
    { text: 'Fuerte', color: '#20c500' },
    { text: 'Muy Fuerte', color: '#157e00' }
  ];

  message.textContent = strengthMessages[Math.max(0, strength - 1)].text;
  message.style.color = strengthMessages[Math.max(0, strength - 1)].color;

  // Si no cumple todos los requisitos, evitar envío y mostrar alerta
  if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar || !hasMinLength) {
    e.preventDefault(); // Detener envío del formulario
    alert("La contraseña debe contener:\n- Mayúsculas\n- Minúsculas\n- Números\n- Caracteres especiales ($@#%&/*)\n- Mínimo 8 caracteres");
  }
});
/*const passwordInput = document.getElementById('password');
const message = document.getElementById('message') ;

passwordInput.addEventListener("input",() => {
        const password  = passwordInput.value;
        let strength = 0;

        //Suma 1 si la contraseña tiene letras minusculas
        if(password.match(/[a-z]+/)){
            strength++;
        }
         //Suma 1 si la contraseña tiene letras mayusculas
         if(password.match(/[A-Z]+/)){
            strength++;
        }
         //Suma 1 si la contraseña tiene numeros 0-9
         if(password.match(/[0-9]+/)){
            strength++;
        }
         //Suma 1 si la contraseña tiene caracteres especiales
         if(password.match(/[$@#%&/*]+/)){
            strength++;
        }
         //Suma 1 si la contraseña tiene mas de 8 caracteres 
         if(password.length >= 8){
            strength++;
        }

        //Muestra el mensaje de acuerdo a la contraseña 

        switch(strength){

            case 0:
                case 1:
                    message.textContent = 'Muy Débil';
                    message.style.color='#ff0000';
                break;
                case 2:
                    message.textContent = 'Débil';
                    message.style.color='#ff6C00';
                break;
                case 3:
                    message.textContent = 'Media';
                    message.style.color='#ffe000';
                break;
                case 4:
                    message.textContent = 'Fuerte';
                    message.style.color='#20c500';
                break;
                case 5:
                    message.textContent = 'Muy Fuerte';
                    message.style.color='#157e00';
                break;
        }
});*/
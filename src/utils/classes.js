export const CLASSNAMES = {
  buttons: {
    primary: "button-primary",
    secondary: "button-secondary"
  },
  inputs: {
    box: "input-box"
  },
  labels: {
    text: "label-text"
  }
  
};

// Exemplo de uso em componentes Vue:
// <button :class="CLASSNAMES.buttons.primary">Enviar</button>
// <input :class="CLASSNAMES.inputs.box" id="cpf-input" />
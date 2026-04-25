/* ./pitpar/js/form.js */
export function setupForm(formId, statusId, buttonId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const status = document.getElementById(statusId);
  const button = document.getElementById(buttonId);
  const select = form.querySelector("select[name='type']");
  const textarea = form.querySelector("textarea");
  const emailInput = form.querySelector("input[name='email']");

  // ✅ Cambiar placeholder dinámicamente
  if (select && textarea) {
  const updatePlaceholder = () => {
    const type = select.value;

    if (type === "CONTRATO") {
      textarea.placeholder = "Cuéntame sobre el evento, fecha, lugar...";
    } else if (type === "COLAB") {
      textarea.placeholder = "¿Qué tipo de colaboración tienes en mente?";
    } else if (type === "PRENSA") {
      textarea.placeholder = "¿Para qué medio o entrevista es?";
    } else {
      textarea.placeholder = "Escribe tu mensaje...";
    }
  };

  select.addEventListener("change", updatePlaceholder);

  updatePlaceholder();
}

  // ✅ Envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    button.disabled = true;
    status.innerHTML = "Enviando... ⏳";

    const data = new FormData(form);

    const type = form.querySelector("select[name='type']").value;
    data.append("_subject", `[${type}] Nuevo mensaje desde Piter Parque`);

    // ✅ reply-to (bien hecho)
    if (emailInput) {
      data.append("_replyto", emailInput.value);
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/piter.parque2002@gmail.com", {
        method: "POST",
        body: data
      });

      if (response.ok) {
        status.innerHTML = "✅ Mensaje enviado";
        form.reset();
      } else {
        status.innerHTML = "❌ Error al enviar";
      }
    } catch (error) {
      status.innerHTML = "⚠️ Error de conexión";
    }

    button.disabled = false;
  });
}
(function () {
  emailjs.init({
    publicKey: "b3rM7F_aqAivTbSxN",
  });
})();

const form = document.getElementById("contact-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  emailjs.sendForm("service_op5a0tm", "template_vyljcpk", form).then(
    function () {
      alert("Сообщение отправлено ✅");
      form.reset();
    },
    function (error) {
      console.error("FAILED...", error);
      alert("Ошибка при отправке ❌");
    }
  );
});

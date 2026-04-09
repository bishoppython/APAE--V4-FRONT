const btn = document.getElementById("cadastrarBtn");

btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const payload = {
    nome: document.getElementById("nome").value.trim(),
    sexo: document.getElementById("sexo").value,
    cpf: document.getElementById("cpf").value.trim(),
    idade: parseInt(document.getElementById("idade").value, 10) || null,
    diagnostico: document.getElementById("diagnostico").value.trim(),
    senha: document.getElementById("senha").value
  };

  for (let k of ["nome", "cpf", "senha"]) {
    if (!payload[k]) { alert("Preencha os campos obrigatórios"); return; }
  }

  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Erro ao cadastrar");
      return;
    }

    sessionStorage.setItem("usuarioNome", payload.nome);
    alert("Cadastrado com sucesso!");
    window.location.href = "/dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Erro de conexão com o servidor.");
  }
});

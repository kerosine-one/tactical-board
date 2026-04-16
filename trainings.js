async function loadTrainings() {

  const type = document.getElementById("type").value;
  const age = document.getElementById("age").value;
  const search = document.getElementById("search").value;

  const res = await fetch(
    `get_trainings.php?type=${type}&age=${age}&search=${search}`
  );

  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(t => {
    list.innerHTML += `
      <div class="training-card">
        <h2>${t.name}</h2>
        <p>Age: ${t.age_group}</p>
        <p>Type: ${t.type}</p>
        <p>${t.comment}</p>
        <img src="${t.image_name}" width="500">
        <p>${t.created_at}</p>
      </div>
    `;
  });
}

loadTrainings();
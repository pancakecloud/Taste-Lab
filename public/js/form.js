// const form = document.getElementById("tasteForm");

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const data = {
//     id: Date.now(),
//     taste: form.taste.value,
//     texture: form.texture.value,
//     sound: form.sound.value
//   };

//   const res = await fetch("/api/submit", {
//     method: "POST",
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify(data)
//   });

//   if (res.ok) {
//     alert("Your taste has been sent!");
//     form.reset();
//   } else {
//     alert("Submission failed.");
//   }
// });


const form = document.getElementById("tasteForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const taste = form.elements["taste"].value;
  const sound = form.elements["sound"].value;
  const texture = form.elements["texture"].value;

  const submission = { taste, sound, texture };

  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission)
    });

    if (res.ok) {
      alert("Submission saved!");
      form.reset();

      // Trigger visualisation update
      if (window.updateVisualisation) {
        window.updateVisualisation();
      }
    } else {
      alert("Error saving submission.");
    }
  } catch (err) {
    console.error(err);
    alert("Error saving submission.");
  }
});


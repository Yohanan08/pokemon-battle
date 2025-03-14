const pokemon1 = { name: "", hp: 100, attack: 10, img: "" };
        const pokemon2 = { name: "", hp: 100, attack: 10, img: "" };

        async function fetchPokemon(id, pokemon) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            
            pokemon.name = data.name;
            pokemon.img = data.sprites.front_default;
            pokemon.attack = data.stats[1].base_stat;
            
            updateUI();
        }

        function updateUI() {
            document.getElementById("name1").textContent = pokemon1.name;
            document.getElementById("img1").src = pokemon1.img;
            document.getElementById("hp1").textContent = pokemon1.hp;
            
            document.getElementById("name2").textContent = pokemon2.name;
            document.getElementById("img2").src = pokemon2.img;
            document.getElementById("hp2").textContent = pokemon2.hp;
        }

        function attack(target) {
            if (target === 1) {
                pokemon1.hp -= pokemon2.attack;
                if (pokemon1.hp <= 0) pokemon1.hp = 0;
            } else {
                pokemon2.hp -= pokemon1.attack;
                if (pokemon2.hp <= 0) pokemon2.hp = 0;
            }
            updateUI();
            checkWinner();
        }

        function checkWinner() {
            if (pokemon1.hp <= 0) {
                alert(`${pokemon2.name} gana la batalla!`);
            } else if (pokemon2.hp <= 0) {
                alert(`${pokemon1.name} gana la batalla!`);
            }
        }

        fetchPokemon(Math.floor(Math.random() * 150) + 1, pokemon1);
        fetchPokemon(Math.floor(Math.random() * 150) + 1, pokemon2);

        document.getElementById("restartGame").addEventListener("click", function() {
            window.location.reload(); // Recarga la página
          });
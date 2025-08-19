const pokemon1 = { name: "", hp: 100, attack: 10, img: "", level: 5, nextEvolution: null, evolutionLevel: null };
const pokemon2 = { name: "", hp: 100, attack: 10, img: "", level: 5, nextEvolution: null, evolutionLevel: null };

// Diccionario de evoluciones simples (puedes expandirlo)
const evolutions = {
    bulbasaur: { next: "ivysaur", level: 16 },
    charmander: { next: "charmeleon", level: 16 },
    squirtle: { next: "wartortle", level: 16 },
    pikachu: { next: "raichu", level: 20 }
    // Agrega más si quieres
};

async function fetchPokemon(id, pokemon) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();

    pokemon.name = data.name;
    pokemon.img = data.sprites.front_default;
    pokemon.attack = data.stats[1].base_stat;
    pokemon.hp = data.stats[0].base_stat + 50;
    pokemon.level = Math.floor(Math.random() * 10) + 5;
    pokemon.abilities = data.abilities.slice(0, 2).map(a => a.ability.name);

    // Obtener la evolución usando species y evolution_chain
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    const evoChainResponse = await fetch(speciesData.evolution_chain.url);
    const evoChainData = await evoChainResponse.json();

    // Buscar la siguiente evolución (si existe)
    let nextEvolution = null;
    let evo = evoChainData.chain;
    while (evo && evo.species.name !== pokemon.name && evo.evolves_to.length > 0) {
        evo = evo.evolves_to[0];
    }
    if (evo && evo.evolves_to.length > 0) {
        nextEvolution = evo.evolves_to[0].species.name;
    }

    if (nextEvolution) {
        pokemon.nextEvolution = nextEvolution;
        pokemon.evolutionLevel = 10; // Todos evolucionan al nivel 10
    } else {
        pokemon.nextEvolution = null;
        pokemon.evolutionLevel = null;
    }

    updateUI();
}

function attack(target) {
    if (target === 1) {
        pokemon1.hp -= pokemon2.attack;
        if (pokemon1.hp < 0) pokemon1.hp = 0;
        subirNivel(pokemon2);
        animateHit("pokemon1");
    } else {
        pokemon2.hp -= pokemon1.attack;
        if (pokemon2.hp < 0) pokemon2.hp = 0;
        subirNivel(pokemon1);
        animateHit("pokemon2");
    }
    updateUI();
    checkWinner();
}

// Animación de golpe
function animateHit(pokemonDivId) {
    const pokeDiv = document.getElementById(pokemonDivId);
    pokeDiv.classList.add("hit");
    setTimeout(() => {
        pokeDiv.classList.remove("hit");
    }, 400);
}

// Animación de evolución (modifica tu función evolucionar así:)
async function evolucionar(pokemon) {
    const winnerDiv = document.getElementById("winner");
    winnerDiv.textContent = `${pokemon.name} está evolucionando a ${pokemon.nextEvolution}!`;

    // Animación de evolución
    const pokeDiv = pokemon === pokemon1 ? document.getElementById("pokemon1") : document.getElementById("pokemon2");
    pokeDiv.classList.add("evolve");

    setTimeout(async () => {
        // Busca los datos del Pokémon evolucionado
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.nextEvolution}`);
        const data = await response.json();
        pokemon.name = data.name;
        pokemon.img = data.sprites.front_default;
        pokemon.attack = data.stats[1].base_stat + Math.floor(pokemon.level / 2);
        pokemon.hp = data.stats[0].base_stat + 50 + pokemon.level * 2;
        pokemon.abilities = data.abilities.slice(0, 2).map(a => a.ability.name);

        // Verifica si hay otra evolución
        // ...tu lógica de evolución automática...
        pokemon.nextEvolution = null;
        pokemon.evolutionLevel = null;

        updateUI();

        pokeDiv.classList.remove("evolve");
        setTimeout(() => {
            winnerDiv.textContent = "";
        }, 1000);
    }, 1000);
}

function updateUI() {
    document.getElementById("name1").textContent = `${pokemon1.name} (Nv. ${pokemon1.level})`;
    document.getElementById("img1").src = pokemon1.img;
    document.getElementById("hp1").textContent = pokemon1.hp;
    document.getElementById("name2").textContent = `${pokemon2.name} (Nv. ${pokemon2.level})`;
    document.getElementById("img2").src = pokemon2.img;
    document.getElementById("hp2").textContent = pokemon2.hp;
}

function checkWinner() {
    const winnerDiv = document.getElementById("winner");
    const attackBtn1 = document.getElementById("attack1");
    const attackBtn2 = document.getElementById("attack2");

    if (pokemon1.hp <= 0) {
        winnerDiv.textContent = `${pokemon2.name} gana la batalla!`;
        attackBtn1.disabled = true;
        attackBtn2.disabled = true;
    } else if (pokemon2.hp <= 0) {
        winnerDiv.textContent = `${pokemon1.name} gana la batalla!`;
        attackBtn1.disabled = true;
        attackBtn2.disabled = true;
    } else {
        winnerDiv.textContent = "";
        attackBtn1.disabled = false;
        attackBtn2.disabled = false;
    }
}

// Subir nivel y evolucionar si corresponde
function subirNivel(pokemon) {
    pokemon.level += 1;
    // Cada nivel sube un poco el ataque y la vida
    pokemon.attack += 2;
    pokemon.hp += 5;

    // Evolución
    if (pokemon.nextEvolution && pokemon.level >= pokemon.evolutionLevel) {
        evolucionar(pokemon);
    }
}

async function evolucionar(pokemon) {
    const winnerDiv = document.getElementById("winner");
    winnerDiv.textContent = `${pokemon.name} está evolucionando a ${pokemon.nextEvolution}!`;
    // Busca los datos del Pokémon evolucionado
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.nextEvolution}`);
    const data = await response.json();
    pokemon.name = data.name;
    pokemon.img = data.sprites.front_default;
    pokemon.attack = data.stats[1].base_stat + Math.floor(pokemon.level / 2);
    pokemon.hp = data.stats[0].base_stat + 50 + pokemon.level * 2;
    pokemon.abilities = data.abilities.slice(0, 2).map(a => a.ability.name);

    // Verifica si hay otra evolución
    if (evolutions[pokemon.name]) {
        pokemon.nextEvolution = evolutions[pokemon.name].next;
        pokemon.evolutionLevel = evolutions[pokemon.name].level;
    } else {
        pokemon.nextEvolution = null;
        pokemon.evolutionLevel = null;
    }
    updateUI();

    // Borra el mensaje de evolución después de 2 segundos
    setTimeout(() => {
        winnerDiv.textContent = "";
    }, 2000);
}

// Inicializa dos Pokémon aleatorios
fetchPokemon(Math.floor(Math.random() * 150) + 1, pokemon1);
fetchPokemon(Math.floor(Math.random() * 150) + 1, pokemon2);

document.getElementById("restartGame").addEventListener("click", function() {
    window.location.reload();
});
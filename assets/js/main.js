const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
let returnButton;  // Declare a variável returnButton
const limit = 9;
let offset = 0;

function createReturnButton() {
    // Cria uma cópia do botão original
    returnButton = loadMoreButton.cloneNode(true);
    returnButton.id = 'returnButton';
    returnButton.textContent = 'Return';
    returnButton.classList.add('button'); // Adiciona a classe 'button' para obter a estilização desejada
    returnButton.addEventListener('click', () => {
        offset -= limit;
        loadPokemonItens(offset, limit);
    });
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}">
                <span class="name">${pokemon.name}</span>
    
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
    
                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </li>
        `).join('');
        pokemonList.innerHTML = newHtml;

        // Adiciona ou remove o botão de retorno com base no valor do offset
        if (offset > 0 && !document.contains(returnButton)) {
            createReturnButton();
            document.querySelector('.pagination').appendChild(returnButton); // Adiciona o botão como filho da div pagination
        } else if (offset === 0 && document.contains(returnButton)) {
            document.querySelector('.pagination').removeChild(returnButton);
            returnButton = null;  // Define returnButton como null para indicar que não está mais no documento
        }
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    loadPokemonItens(offset, limit);
});

const dynamicText = document.getElementById('dynamicText');

// Divide o texto em letras individuais e cria spans para cada uma
dynamicText.innerHTML = dynamicText.textContent
    .split('')
    .map(letter => `<span class="letter">${letter}</span>`)
    .join('');

const letters = document.querySelectorAll('.letter');

dynamicText.addEventListener('mousemove', (event) => {
    const boundingBox = dynamicText.getBoundingClientRect();
    const mouseX = event.clientX - boundingBox.left;

    // Calcula a porcentagem da largura onde o cursor está
    const percentage = (mouseX / boundingBox.width) * 100;

    // Muda a cor da letra exata sob o cursor
    letters.forEach((letter, index) => {
        const letterWidth = letter.getBoundingClientRect().width;
        const letterPosition = (index / letters.length) * 100;

        if (percentage >= letterPosition && percentage <= letterPosition + (letterWidth / boundingBox.width) * 100) {
            // Gera cores aleatórias para cada letra
            const randomHue = Math.random() * 360;
            const randomSaturation = Math.random() * 100;
            const randomLightness = Math.random() * 50 + 50; // Garante uma luminosidade mínima de 50%

            // Ajusta a cor com base nas cores aleatórias geradas
            letter.style.color = `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;
        } else {
            letter.style.color = '#000'; // Restaura a cor padrão para outras letras
        }
    });
});

dynamicText.addEventListener('mouseleave', () => {
    // Restaura a cor padrão para todas as letras quando o mouse deixa o elemento
    letters.forEach(letter => letter.style.color = '#000');
});

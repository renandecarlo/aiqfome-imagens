[![aiqfome-imagens](https://user-images.githubusercontent.com/6974980/139386712-d5c596ab-5b26-45f4-a538-ae13a63e3984.png)](https://renandecarlo.github.io/aiqfome-imagens/ "aiqfome-imagens")

Esta ferramenta facilita a vida de CMs aiqfome com a criação de imagens de divulgação de parceiros.

Acesse pelo link: **https://renandecarlo.github.io/aiqfome-imagens/**
<br /><br />

## Como funciona
A ferramenta permite a criação de diversas imagens de divulgação a partir do envio de uma logo.

## Desenvolvimento
Este site foi criado com [<img src="https://cdn.worldvectorlogo.com/logos/vue-js-1.svg" height="34">](https://github.com/vuejs/vue "Vue.js") [<img src="https://cdn.worldvectorlogo.com/logos/vuetify.svg" height="40">](https://github.com/vuetifyjs/vuetify "Vuetify")

Ele idêntifica as máscaras nas imagens na hora do build e salva as coordenadas e tamanhos corretos em um arquivo `json`.
As imagens são geradas diretamente pelo navegador com a biblioteca [`Jimp`](https://github.com/oliver-moran/jimp "Jimp"), sem a necessidade de um servidor back-end.
Em caso de múltiplas imagens, é criado um arquivo Zip com a biblioteca [`JSZip`](https://github.com/Stuk/jszip "JSZip").

## Como ajudar
Adicione novas imagens criando uma máscara em verde (`#60fc1c`,`rgb:96,252,28`) como na [imagem modelo](https://raw.githubusercontent.com/renandecarlo/aiqfome-imagens/main/src/assets/resources/masks/modelo_feed_com_logo.png "imagem modelo") e me envie, ou faça um pull request rs

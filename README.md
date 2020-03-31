# Registro e controle de pacientes: fisioterapia pélvica.

O projeto em questão tem por finalizade fornecer uma ferramenta que permita o registro e o resgate de informações de pacientes. Serão implementadas, posteriormente, mecanismos que permitam a análise das informações registratas bem como scripts para automação de backups.

## Instalação
Ao clonar o aplicativo, você precisará instalar as dependências. Acesse a raíz do aplicativo e execute:
`nmp install`

Para iniciá-lo execute, na pasta raís do paplicativo, o comando:
`node index.js`

O aplicativo estará acessível em **http://[IP_DA_MAQUINA_NA_REDE]:3000/**.

## Executando o aplicativo em um Smartphone
Os aplicativos Node podem ser facilmente executados em um Smartphone. Testado apenas em sistemas Android...

### Instale o Termux
Baixe-o na loja de aplicativos Google Play ou similar.

### Instale o None dentro do Termux
Abra o aplicativo e execute o comando: 
`apt install nodejs`

### Instale o FisioPelvis conforme o que foi descrito anteriormente

### Acesso ao programa
Conecte o telefone na rede WiFi ou configure-o como ponto de acesso. Abra o Termux e execute: 
`node index.js`

O programa estará acessível em **http://[IP_DO_TELEFONE]:3000/**.


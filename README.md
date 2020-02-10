# LuizaLabs Wishlist
### Lista de desejos :memo:
Essa aplicação permite que clientes do Magalu possam salvar produtos favoritos em uma lista de desejos.

# Construído com...

- NodeJS v12.14
- Express
- Mongoose
- Nodemon
- Sucrase
- MongoDB
- Redis

## Configurações do Ambiente

Tanto MongoDB quanto Redis foram utilizados via Docker.

- MongoDB:

        docker run --name *** -p 27018:27017 -d -t mongo

- Redis:

        docker run --name *** -p 6379:6379 -d -t redis:alpine

### Variáveis de ambiente
Para que o servidor funcione é preciso configurar as variáveis de ambiente. Copie ou renomeie o arquivo `.env.example` para `.env` e adicione as informações de acordo com suas configurações.

## Depenências
Antes de iniciar o servidor, é preciso baixar os pacotes dependências. Você pode rodar o comando:


    yarn
Ou


    npm install


## Iniciar o Servidor

Para iniciar o servidor, você pode rodar o seguinte comando:


    yarn dev

Ou

    npm run dev

Após inicar o servidor deve retornar a seguinte mensagem no console.

    Server is running on port {PORT}

## Rotas

Se estiver usando um Cliente de API Rest, como Insomnia ou Postman, pode baixar o arquivo de configuração com as rotas prontas [aqui](https://pastebin.com/Jb4J7a8V "Arquivo de configuração de rotas").

Exemplo de como devem ser os corpos das requisições:

![image](https://user-images.githubusercontent.com/27585155/74196619-025ed080-4c34-11ea-8fc7-a0c7bf38a7c1.png)

#### OBS.: Rotas autenticadas
Para rotas autenticadas é preciso enviar o Bearer Token através do HEADER recebido através do login do cliente.

### Cliente

- Visualização: `GET /customer`
	- Retorna os dados do usuário para visualização.
	- Rota autenticada.

- Cadastro:  `POST /customer`
	- Cria um usuário no sistema.

	 Body:
    ```JSON
	{
		name: "John Doe",
		email: "john.doe@mail.ship"
	}
    ```
- Login: `POST /login`
	- Autentica o cliente na aplicação.

	Body:
    ```JSON
	{
		email: "john.doe@mail.ship"
	}
    ```

- Atualização: `PUT /customer`
	- Deleta o usuário do cadastro do sistema.
	- Rota autenticada.

	 Body:
    ```JSON
	{
		name: "John Doe",
		email: "john.doe@mail.ship"
	}
    ```
- Deletar: `DELETE /customer`
	- Deleta o usuário do cadastro do sistema.
	- Rota autenticada.


### Lista de desejos

- Listar: `GET /wishlist?page=1`
    - Mostra os produtos salvos na lista de desejo por paginação, por padrão é iniciado sempre na página 1.
    -  Por padrão o limite de produtos na listagem é 10, mas pode ser configurado em `src/config/wishlist.js`.
    - Rota autenticada.

- Adicionar produto: `PUT /wishlist/:product_id?option=add`
    - Adiciona o produto de acordo com o id apresentado no parâmetro da url.
    - Rota autenticada.

- Remover produto: `PUT /wishlist/:product_id?option=remove`
    - Remove o produto de acordo com o id apresentado no parâmetro da url.
    - Rota autenticada.

- Deletar tudo: `DELETE /wishlist`
    - Deleta todos os produtos de uma lista.
    - Rota autenticada.

## Licença

Esse projeto está licenciado sob os termos de Licença do MIT. Veja o arquivo [LICENSE](https://github.com/D4rkM/luizalabs-challenge/blob/master/LICENSE "Arquivo LICENSE").

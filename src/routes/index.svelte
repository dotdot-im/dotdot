<script>
import Phoenix from 'phoenix';

const socket = new Phoenix.Socket("ws://localhost:4000/socket", {
	params: { userToken: "123" }
});

const messages = [];

socket.connect();

socket.onError( () => messages.push('Socket error') )
socket.onClose( () => messages.push("the connection dropped") )

// Join the initial channel
const controlChannel = socket.channel("control");
controlChannel.on("new_msg", msg => messages.push(msg) )

</script>

<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>hic</title>
</svelte:head>

<h1>Chat</h1>

<div id="chatWindow">
  <ul id="messages">
    {#each messages as message}
      <li>{message}</li>
    {/each}
  </ul>
</div>

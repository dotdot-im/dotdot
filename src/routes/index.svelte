<script>
import Phoenix from 'phoenix';

const socket = new Phoenix.Socket("ws://localhost:4000/socket", {
	params: { userToken: "123" }
});

let messages = [];
let message = '';

socket.connect();

socket.onError( () => { messages = messages.concat('Socket error'); })
socket.onClose( () => { messages = messages.concat('Connection dropped'); })

// Join the initial channel
const controlChannel = socket.channel("control:main");
controlChannel.join()
  .receive("ok", resp => { console.log('joined', resp); messages = messages.concat("Joined successfully"); })
  .receive("error", resp => { console.log('error joining', resp); messages = messages.concat("Unable to join"); })

controlChannel.on("control", msg => { console.log('control', msg); messages = messages.concat('control:: ' + msg.message); })
controlChannel.on("new_message", msg => { console.log('message', msg); messages = messages.concat(msg.message); })

controlChannel.on("new:msg", msg => {
  messages = messages.concat(msg);
})

controlChannel.on("user:entered", msg => {
  var username = this.sanitize(msg.user || "anonymous")
  $messages.append(`<br/><i>[${username} entered]</i>`)
})

function handleSubmit() {
  controlChannel.push("new_message", {message: message})
}

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
  <form action="" on:submit={handleSubmit}>
    <input id="m" autocomplete="off" placeholder="Message..." bind:value={message} />
    <button type="submit">Send</button>
  </form>
</div>

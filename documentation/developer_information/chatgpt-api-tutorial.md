# ChatGPT API Tutorial

## To use ChatGPT functionality, you will need an OpenAI API key:

1. Sign up for an OpenAI account at https://platform.openai.com
2. Select 'Settings' (cog wheel at the top right)
3. Select 'API keys'
4. Select '+ Create new secret key'
5. Addd a name and select 'Create secret key'
6. Copy the key
7. Create a file called '.env' in the root directory of the project
8. Add the following line and save: VITE_OPENAI_API_KEY="put your OpenAI API key here"

## Adding 'Ask ChatGPT' to a tool

To add the button to a tool, first add the function imports:

```ts
import AskChatGPT from "../AskChatGPT/AskChatGPT";
import ChatGPTOutput from "../AskChatGPT/ChatGPTOutput";
```

Next, add the state variable:

```ts
const [chatGPTResponse, setChatGPTResponse] = useState("");
```

Lastly, add the button to the renderComponent function:

```ts
<AskChatGPT toolInput={title} output={output} setChatGPTResponse={setChatGPTResponse} />;
{
    chatGPTResponse && (
        <div style={{ marginTop: "20px" }}>
            <h3>ChatGPT Response:</h3>
            <ChatGPTOutput output={chatGPTResponse} />
        </div>
    );
}
```

The Ask ChatGPT button has been added to Traceroute as an example.

## Tuning the ChatGPT responses

#### Adjusting the message sent to ChatGPT:

The button works by calling the AskChatGPT function from /src/components/AskChatGPT.tsx. This function takes the following arguments:

1.  prompt: the prompt to send to chatgpt preceding the tool's console output
2.  data: the output of the tool

If wanting to further tune the functionality, adjust the following lines in AskChatGPT.tsx:

```ts
content: "You are a cyber security assistant analyzing output from penetration testing tools";
```

```ts
const response = await sendToChatGPT(
	`The following ouput is from the use of the ${toolName}. Provide a concise explanation of the tool and what the output shows for someone new to the cybersecurity world:`,
output
```

These lines are sent to ChatGPT as part of an instruction, and will effect the response from the model. Adjusting these can lead to vastly different results, so testing should be done to find the most effective values.

#### Adjusting the ChatGPT model used:

When the Ask ChatGPT function was originally created, the GPT-4o model was the newest general model provided in the OpenAI API. Different models can lead to different results with different performance implications, so the model can be changed on the following line:

```ts
body: JSON.stringify({
	model: "gpt-4o",
```

A list of the OpenAI models can be found at https://platform.openai.com/docs/models.

#### Adjusting the code for different APIs:

The AskChatGPT.tsx file makes use of the built-in <i>fetch</i> function of javascript. This means it can easily be adjusted for other APIs if needed, such as Google's Gemini. To update the function, you will need to update the API URL and headers in the request. You may also need to update the structure of the request, and handle the response differently than the established OpenAI API.

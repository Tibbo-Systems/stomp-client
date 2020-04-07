import React from 'react';
import {Client, Message} from '@stomp/stompjs';
import './App.css';

interface IProps {
}

interface IState {
    event?: string;
    version?: string
}

class App extends React.Component<IProps, IState> {


    constructor(props: any) {
        super(props);
        this.state = {event: "", version: ""};
    }

    async componentDidMount(): Promise<void> {

        const data = {username: "admin", password: "admin"};
        const response = await fetch("http://localhost:8080/rest/auth", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data)
        });
        const res = await response.json();
        const client = new Client({
            brokerURL: "ws://localhost:8080/rest/v1/stomp",
            connectHeaders: {
                Authorization: "Bearer " + res.token,
            },
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });
        client.onConnect = function (frame) {
            // Do something, all subscribes must be done is this callback
            // This is needed because this will be executed after a (re)connect
        };

        client.onStompError = function (frame) {
            // Will be invoked in case of error encountered at Broker
            // Bad login/passcode typically will cause an error
            // Complaint brokers will set `message` header with a brief message. Body may contain details.
            // Compliant brokers will terminate the connection after any error
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };
        client.activate();
    }


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <p>
                            Event: {this.state.event}
                        </p>
                        <p>
                            Variable: {this.state.version}
                        </p>
                    </a>
                </header>
            </div>
        );
    }
}

export default App;
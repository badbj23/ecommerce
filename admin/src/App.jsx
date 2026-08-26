import {SignedIn, SignInButton, SignedOut, UserButton} from "@clerk/clerk-react";


function App() {


    return(
        <div>
        <h1>Home Page</h1>
        <SignedOut>
            <SignInButton mode="modal"/>
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
    </div>
    )
}
export default App


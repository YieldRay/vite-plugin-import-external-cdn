import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "soda-material/dist/style.css";
import { Button } from "soda-material";

function App() {
    return (
        <div>
            <Button>Button</Button>
        </div>
    );
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);

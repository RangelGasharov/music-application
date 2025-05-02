export const buttonSx = {
    color: "var(--text-color)",
    width: "100%",
    boxShadow: "1px 2px 2px var(--text-shadow)",
    backgroundColor: "var(--cards-background-color)",

    ":hover": {
        background: "var(--text-color)",
        color: "var(--cards-background-color)",
    }
}

export const errorButtonSx = {
    ...buttonSx,
    backgroundColor: "error.main",
    color: "white",
    padding: ".5rem",
    ":hover": {
        backgroundColor: "error.dark",
        color: "white",
    }
}
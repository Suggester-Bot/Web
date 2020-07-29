import React from "react";
import icon from "./assets/icon.png";
import styles from "./App.module.css";

const App = () => (
	<div className={styles.app}>
		<div className={styles.navbar}>
			<div><img src={icon} alt="Suggester icon" className={styles.icon} /></div>
			<div>
				<a
					href="https://discord.gg/XR6UhAj"
					className={styles.navbarLink}
					target="_blank"
					rel="noreferrer"
				>Discord server</a>
				<a
					href={"https://discordapp.com/oauth2/authorize?client_id=564426594144354315&scope=bot&permissions=805694544"}
					className={styles.navbarLink}
					target="_blank"
					rel="noreferrer"
				>Invite bot</a>
			</div>
		</div>
	</div>
);

export default App;

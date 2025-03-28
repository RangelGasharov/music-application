import PlayerControls from "./PlayerControls"
import PlayerImage from "./PlayerImage"

type Props = {}

export default function PlayerBox({ }: Props) {
    return (
        <div>
            <div>
                <PlayerImage />
            </div>
            <div>
                <PlayerControls />
            </div>
        </div>
    )
}
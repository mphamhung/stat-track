import {SpeedDial, SpeedDialIcon, SpeedDialAction} from '@mui/material';


export default function StyleButton(props) {
    const actions = ['Huck', 'Lefty', 'Hammer', 'Scoober']

    return (
        <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        >
            {actions.map((action) => (
            <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            />
            ))}
        </SpeedDial>
    )
}
import React, { createContext, useContext, useState } from 'react';
import { Flex, Button } from '@chakra-ui/react';

import './Dropdown.css';
const DropdownContext = createContext({
    open: true,
    setOpen: (_:boolean) => {}
});
export function Dropdown(
    {children}:{children:React.ReactNode}
) {
    const [open, setOpen] = useState(false);
    return <>
        <DropdownContext.Provider value={{open, setOpen}}>
                {children}
        </DropdownContext.Provider>
    </>
}
export function DropdownTrigger(
    {children}:{children:React.ReactNode}
) {
    const {open, setOpen} = useContext(DropdownContext);
    return <Button w={10} h={10} className='dropdown-trigger' onClick={() => setOpen(!open)}>
        {children}
    </Button>
}
export function DropdownList(
    {children}:{children:React.ReactNode}
) {
    const { open } = useContext(DropdownContext);
    return <ul className={'dropdown-list '+(open ? 'show' : 'hide')}>
        <Flex
            p={2}
            color="gray.500"
            bg="white"
            borderWidth={1}
            borderRadius={2}
            direction="column"
            alignItems="start"
            gap={1}
            zIndex={2}
            position="absolute"
            width="fit-content"
            height="fit-content"
            display="flex"
            >
            {children}
        </Flex>
    </ul>
}
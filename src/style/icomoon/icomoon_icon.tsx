import * as React from 'react';

export const MenuIcon = ({ icon }: { icon: string }) => (
    <>
        <span className='anticon'>
            <i className={icon} />
        </span>
    </>
);
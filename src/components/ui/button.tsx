import * as React from 'react';

function Button({ children, className, ...props }: React.ComponentProps<'button'>) {
    return <button className={'bg-red-600'}>
        {children}
    </button>
}

export { Button }


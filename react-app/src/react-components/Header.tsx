import { useMemo } from 'react';

interface HeaderProps {
    logoSrc?: string;
    logoAlt?: string;
    navOptions?: Map<string, () => void>;
    className?: string;
}


export default function Header({
    logoSrc,
    logoAlt = "",
    navOptions,
    className
}: HeaderProps) {

    const barOptions = useMemo(() => {
        if (!navOptions) {
            return;
        }
        const result = [];
        for (const [key, value] of navOptions) {
            result.push(<button onClick={value} key={key}>{key}</button>);
        }
        return result;
    }, [navOptions]);

    return <header className={className}>
        {logoSrc ?
            <img src={logoSrc} alt={logoAlt}></img>
            : null
        }
        <div>
            {barOptions}
        </div>
    </header>;
}
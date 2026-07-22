// saarthiIQ-Frontend\src\components\BrandLogo.jsx
import { useTheme } from '@/context/ThemeContext';
import logoFullDark from '@/assets/logo/saarthiHire-full-dark.png';
import logoFullLight from '@/assets/logo/saarthiHire-full-light.png';

export default function BrandLogo({ className }) {
    const { theme } = useTheme();
    // dark mode → show light logo (for contrast), light mode → show dark logo
    const src = theme === 'dark' ? logoFullLight : logoFullDark;

    return (
        <img
            src={src}
            alt="SaarthiHire – AI Recruitment Platform"
            className={className}
        />
    );
}
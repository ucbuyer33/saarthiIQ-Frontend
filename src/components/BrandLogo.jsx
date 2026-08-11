// saarthiIQ-Frontend/src/components/BrandLogo.jsx
import { useTheme } from '@/context/ThemeContext';
import logoMark from '@/assets/logo/saarthiHire-mark.png';
import logoFullDark from '@/assets/logo/saarthiHire-full-dark.png';
import logoFullLight from '@/assets/logo/saarthiHire-full-light.png';

export default function BrandLogo({ className, collapsed = false }) {
    const { theme } = useTheme();

    let src;
    if (collapsed) {
        // Both themes use the mark when collapsed
        src = logoMark;
    } else {
        // Expanded: dark mode → light logo (contrast), light mode → dark logo
        src = theme === 'dark' ? logoFullLight : logoFullDark;
    }

    return (
        <img
            src={src}
            alt="SaarthiHire – AI Recruitment Platform"
            className={className}
        />
    );
}
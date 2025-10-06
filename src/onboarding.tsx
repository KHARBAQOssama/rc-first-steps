import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

export interface OnboardingStep {
    target: string;
    title: string;
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    disableBeacon?: boolean;
    spotlightClicks?: boolean;
}

export interface OnboardingConfig {
    steps: OnboardingStep[];
    showProgress?: boolean;
    showSkipButton?: boolean;
    continuous?: boolean;
    scrollToSteps?: boolean;
    scrollOffset?: number;
    disableOverlay?: boolean;
    disableScrolling?: boolean;
    spotlightPadding?: number;
    styles?: {
        overlay?: React.CSSProperties;
        spotlight?: React.CSSProperties;
        tooltip?: React.CSSProperties;
        buttonNext?: React.CSSProperties;
        buttonBack?: React.CSSProperties;
        buttonSkip?: React.CSSProperties;
    };
}

interface OnboardingContextType {
    isActive: boolean;
    currentStep: number;
    start: () => void;
    stop: () => void;
    next: () => void;
    back: () => void;
    goToStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within OnboardingProvider');
    }
    return context;
};

interface OnboardingProviderProps {
    children: ReactNode;
    config: OnboardingConfig;
    run?: boolean;
    onComplete?: () => void;
    onSkip?: () => void;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
    children,
    config,
    run = false,
    onComplete,
    onSkip,
}) => {
    const [isActive, setIsActive] = useState(run);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        setIsActive(run);
    }, [run]);

    const start = () => {
        setCurrentStep(0);
        setIsActive(true);
    };

    const stop = () => {
        setIsActive(false);
        setCurrentStep(0);
    };

    const next = () => {
        if (currentStep < config.steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsActive(false);
            onComplete?.();
        }
    };

    const back = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (step: number) => {
        if (step >= 0 && step < config.steps.length) {
            setCurrentStep(step);
        }
    };

    const handleSkip = () => {
        setIsActive(false);
        onSkip?.();
    };

    return (
        <OnboardingContext.Provider value={{ isActive, currentStep, start, stop, next, back, goToStep }}>
            {children}
            {isActive && (
                <OnboardingOverlay
                    config={config}
                    currentStep={currentStep}
                    onNext={next}
                    onBack={back}
                    onSkip={handleSkip}
                />
            )}
        </OnboardingContext.Provider>
    );
};

interface OnboardingOverlayProps {
    config: OnboardingConfig;
    currentStep: number;
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
    config,
    currentStep,
    onNext,
    onBack,
    onSkip,
}) => {
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
    const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
    const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
    const [showArrow, setShowArrow] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const step = config.steps[currentStep];

    useEffect(() => {
        const updatePosition = () => {
            const target = document.querySelector(step.target) as HTMLElement;
            if (!target) {
                console.warn(`Onboarding: Target element "${step.target}" not found`);
                return;
            }

            const rect = target.getBoundingClientRect();
            const padding = config.spotlightPadding || 8;

            setSpotlightStyle({
                position: 'fixed',
                top: `${rect.top - padding}px`,
                left: `${rect.left - padding}px`,
                width: `${rect.width + padding * 2}px`,
                height: `${rect.height + padding * 2}px`,
                borderRadius: '8px',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
                pointerEvents: step.spotlightClicks ? 'none' : 'auto',
                zIndex: 9998,
                transition: 'all 0.3s ease',
                ...config.styles?.spotlight,
            });

            if (config.scrollToSteps) {
                const offset = config.scrollOffset || 100;
                const elementPosition = rect.top + window.scrollY;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }

            setTimeout(() => {
                if (!tooltipRef.current) return;

                const tooltipRect = tooltipRef.current.getBoundingClientRect();
                const placement = step.placement || 'auto';
                const gap = 16; 
                const viewportPadding = 16; 

                let top = 0;
                let left = 0;
                let finalPlacement = placement;

                const fitsInViewport = (t: number, l: number) => {
                    return (
                        t >= viewportPadding &&
                        l >= viewportPadding &&
                        t + tooltipRect.height <= window.innerHeight - viewportPadding &&
                        l + tooltipRect.width <= window.innerWidth - viewportPadding
                    );
                };

                const overlapsTarget = (t: number, l: number) => {
                    const tooltipBottom = t + tooltipRect.height;
                    const tooltipRight = l + tooltipRect.width;
                    const targetBottom = rect.bottom;
                    const targetRight = rect.right;

                    return !(
                        t > targetBottom ||
                        tooltipBottom < rect.top ||
                        l > targetRight ||
                        tooltipRight < rect.left
                    );
                };

                const placements = placement === 'auto'
                    ? ['bottom', 'top', 'right', 'left']
                    : [placement, 'bottom', 'top', 'right', 'left'];

                for (const p of placements) {
                    let testTop = 0;
                    let testLeft = 0;

                    switch (p) {
                        case 'top':
                            testTop = rect.top - tooltipRect.height - gap;
                            testLeft = rect.left + rect.width / 2 - tooltipRect.width / 2;
                            break;
                        case 'bottom':
                            testTop = rect.bottom + gap;
                            testLeft = rect.left + rect.width / 2 - tooltipRect.width / 2;
                            break;
                        case 'left':
                            testTop = rect.top + rect.height / 2 - tooltipRect.height / 2;
                            testLeft = rect.left - tooltipRect.width - gap;
                            break;
                        case 'right':
                            testTop = rect.top + rect.height / 2 - tooltipRect.height / 2;
                            testLeft = rect.right + gap;
                            break;
                    }

                    if (testLeft < viewportPadding) {
                        testLeft = viewportPadding;
                    }
                    if (testLeft + tooltipRect.width > window.innerWidth - viewportPadding) {
                        testLeft = window.innerWidth - tooltipRect.width - viewportPadding;
                    }

                    if (testTop < viewportPadding) {
                        testTop = viewportPadding;
                    }
                    if (testTop + tooltipRect.height > window.innerHeight - viewportPadding) {
                        testTop = window.innerHeight - tooltipRect.height - viewportPadding;
                    }

                    if (!overlapsTarget(testTop, testLeft) && fitsInViewport(testTop, testLeft)) {
                        top = testTop;
                        left = testLeft;
                        finalPlacement = p as 'top' | 'bottom' | 'left' | 'right';
                        break;
                    }
                }

                if (top === 0 && left === 0) {
                    switch (placements[0]) {
                        case 'top':
                            top = rect.top - tooltipRect.height - gap * 2;
                            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                            finalPlacement = 'top';
                            break;
                        case 'bottom':
                            top = rect.bottom + gap * 2;
                            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                            finalPlacement = 'bottom';
                            break;
                        case 'left':
                            top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                            left = rect.left - tooltipRect.width - gap * 2;
                            finalPlacement = 'left';
                            break;
                        case 'right':
                            top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                            left = rect.right + gap * 2;
                            finalPlacement = 'right';
                            break;
                    }
                }

                if (left < viewportPadding) left = viewportPadding;
                if (left + tooltipRect.width > window.innerWidth - viewportPadding) {
                    left = window.innerWidth - tooltipRect.width - viewportPadding;
                }
                if (top < viewportPadding) top = viewportPadding;
                if (top + tooltipRect.height > window.innerHeight - viewportPadding) {
                    top = window.innerHeight - tooltipRect.height - viewportPadding;
                }

                setTooltipStyle({
                    position: 'fixed',
                    top: `${top}px`,
                    left: `${left}px`,
                    zIndex: 9999,
                    opacity: 1,
                });

                const arrowSize = 12;
                let arrowTop = 0;
                let arrowLeft = 0;
                let arrowTransform = '';

                switch (finalPlacement) {
                    case 'top':
                        arrowTop = tooltipRect.height;
                        arrowLeft = rect.left + rect.width / 2 - left - arrowSize / 2;
                        arrowTransform = 'rotate(180deg)';
                        break;
                    case 'bottom':
                        arrowTop = -arrowSize;
                        arrowLeft = rect.left + rect.width / 2 - left - arrowSize / 2;
                        arrowTransform = 'rotate(0deg)';
                        break;
                    case 'left':
                        arrowTop = rect.top + rect.height / 2 - top - arrowSize / 2;
                        arrowLeft = tooltipRect.width;
                        arrowTransform = 'rotate(90deg)';
                        break;
                    case 'right':
                        arrowTop = rect.top + rect.height / 2 - top - arrowSize / 2;
                        arrowLeft = -arrowSize;
                        arrowTransform = 'rotate(-90deg)';
                        break;
                }

                if (arrowLeft < arrowSize) arrowLeft = arrowSize;
                if (arrowLeft > tooltipRect.width - arrowSize * 2) {
                    arrowLeft = tooltipRect.width - arrowSize * 2;
                }

                setArrowStyle({
                    position: 'absolute',
                    top: `${arrowTop}px`,
                    left: `${arrowLeft}px`,
                    transform: arrowTransform,
                });
                setShowArrow(true);
            }, 50);
        };

        updatePosition();

        const initialTimeout = setTimeout(updatePosition, 100);

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            clearTimeout(initialTimeout);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [currentStep, step, config]);

    return (
        <>
            {!config.disableOverlay && <div style={spotlightStyle} />}
            <div ref={tooltipRef} style={{ ...tooltipStyle, ...config.styles?.tooltip, opacity: tooltipStyle.opacity || 0 }}>
                <div
                    style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                        maxWidth: '400px',
                        minWidth: '280px',
                        position: 'relative',
                    }}
                >
                    {showArrow && (
                        <div
                            style={{
                                ...arrowStyle,
                                width: 0,
                                height: 0,
                                borderLeft: '12px solid transparent',
                                borderRight: '12px solid transparent',
                                borderBottom: '12px solid white',
                                filter: 'drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.1))',
                            }}
                        />
                    )}
                    {config.showProgress && (
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>
                            Step {currentStep + 1} of {config.steps.length}
                        </div>
                    )}
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600', color: '#111' }}>
                        {step.title}
                    </h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#444', lineHeight: '1.6' }}>
                        {step.content}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {currentStep > 0 && (
                                <button
                                    onClick={onBack}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        background: 'white',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.2s',
                                        ...config.styles?.buttonBack,
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#f9fafb';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'white';
                                    }}
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={onNext}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: '#0066ff',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s',
                                    ...config.styles?.buttonNext,
                                }}
                                onMouseOver={(e) => {
                                    if (!config.styles?.buttonNext?.background) {
                                        e.currentTarget.style.background = '#0052cc';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!config.styles?.buttonNext?.background) {
                                        e.currentTarget.style.background = '#0066ff';
                                    }
                                }}
                            >
                                {currentStep === config.steps.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                        {config.showSkipButton && (
                            <button
                                onClick={onSkip}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#666',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'all 0.2s',
                                    ...config.styles?.buttonSkip,
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.color = '#333';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.color = '#666';
                                }}
                            >
                                Skip
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export const useStartOnboarding = () => {
    const { start } = useOnboarding();
    return start;
};
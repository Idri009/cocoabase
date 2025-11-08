"use client";

type ConnectButtonProps = {
  label?: string;
  className?: string;
};

export default function ConnectButton({
  label = "Connect Wallet",
  className,
}: ConnectButtonProps) {
  return (
    <appkit-button
      data-variant="primary"
      data-size="lg"
      className={className}
    >
      {label}
    </appkit-button>
  );
}


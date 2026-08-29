<?php

namespace AACSearch;

class AACSearchException extends \Exception
{
    private string $errorCode;
    private array $errorDetails;

    public function __construct(
        string $message = '',
        int $code = 0,
        ?\Throwable $previous = null,
        string $errorCode = 'UNKNOWN_ERROR',
        array $errorDetails = []
    ) {
        parent::__construct($message, $code, $previous);
        $this->errorCode = $errorCode;
        $this->errorDetails = $errorDetails;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getErrorDetails(): array
    {
        return $this->errorDetails;
    }

    public function isAuthenticationError(): bool
    {
        return $this->code === 401 || strpos($this->message, '401') !== false;
    }

    public function isRateLimitError(): bool
    {
        return $this->code === 429 || strpos($this->message, '429') !== false;
    }

    public function isNotFoundError(): bool
    {
        return $this->code === 404 || strpos($this->message, '404') !== false;
    }
}

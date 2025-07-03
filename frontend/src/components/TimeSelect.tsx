import React from "react";

interface TimeSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TimeSelect: React.FC<TimeSelectProps> = ({
  id,
  value,
  onChange,
  className,
}) => {
  // Generar opciones para las horas (10 a 19)
  const hours = Array.from({ length: 10 }, (_, i) =>
    (10 + i).toString().padStart(2, "0")
  );
  // Generar opciones para los minutos (00, 10, ..., 50)
  const minutes = Array.from({ length: 6 }, (_, i) =>
    (i * 10).toString().padStart(2, "0")
  );

  const [hour, minute] = value ? value.split(":") : ["", ""];

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Al cambiar la hora, se mantiene el minuto o se usa '00' por defecto
    onChange(`${e.target.value}:${minute || "00"}`);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Al cambiar el minuto, se mantiene la hora o se usa '10' por defecto
    onChange(`${hour || "10"}:${e.target.value}`);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        id={`${id}-hour`}
        value={hour}
        onChange={handleHourChange}
        className="border border-gray-300 rounded p-2 w-full"
      >
        <option value="" disabled>
          HH
        </option>
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="self-center font-bold">:</span>
      <select
        id={`${id}-minute`}
        value={minute}
        onChange={handleMinuteChange}
        className="border border-gray-300 rounded p-2 w-full"
      >
        <option value="" disabled>
          MM
        </option>
        {minutes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSelect;

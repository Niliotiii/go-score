import { PRESET_COLORS, TEAM_ICONS } from '../lib/constants'

export function TeamStepCard({ team, idx, updateTeam, isLandscape }) {
  function handleColorPick(c) {
    updateTeam(idx, 'color', c)
  }

  return (
    <div
      className={`flex ${isLandscape ? 'flex-row gap-4' : 'flex-col gap-3'} h-full`}
      data-od-id={`team-card-${idx}`}
    >
      <div
        className={`flex flex-col gap-2 ${isLandscape ? 'min-w-[140px] flex-shrink-0' : ''}`}
      >
        <div>
          <label
            htmlFor={`team-name-${idx}`}
            className="block text-xs font-semibold tracking-label uppercase text-goscore-muted mb-1.5"
          >
            Nome do time
          </label>
          <input
            id={`team-name-${idx}`}
            type="text"
            value={team.name}
            onChange={(e) => updateTeam(idx, 'name', e.target.value)}
            placeholder="Ex: Falcoes"
            maxLength={16}
            autoComplete="off"
            className={`w-full rounded-sm border border-goscore-border bg-goscore-surface text-goscore-fg px-3.5 outline-none ${
              isLandscape ? 'h-[38px] text-[15px]' : 'h-11 text-base'
            }`}
          />
        </div>

        <fieldset className="border-0 p-0">
          <legend className="text-xs font-semibold tracking-label uppercase text-goscore-muted mb-1.5">
            Cor
          </legend>
          <div
            className={`grid gap-2.5 px-1.5 ${isLandscape ? 'grid-cols-6 gap-1.5' : 'grid-cols-6'}`}
            role="radiogroup"
            aria-label="Selecionar cor do time"
          >
            {PRESET_COLORS.map((c) => {
              const active = team.color === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorPick(c)}
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  aria-label={`Cor ${c}`}
                  style={{
                    backgroundColor: c,
                    boxShadow: active ? `0 0 0 2px var(--bg), 0 0 0 4px ${c}` : undefined,
                  }}
                  className={`w-full aspect-square rounded-full transition-transform duration-200 ${
                    active
                      ? 'scale-[1.15] border-[2.5px] border-goscore-fg'
                      : 'border-2 border-transparent'
                  }`}
                />
              )
            })}
          </div>
        </fieldset>
      </div>

      <fieldset className={`border-0 p-0 ${isLandscape ? 'flex-1' : ''}`}>
        <legend className="text-xs font-semibold tracking-label uppercase text-goscore-muted mb-1.5">
          Icone
        </legend>
        <div
          className={`grid ${isLandscape ? 'grid-cols-8 gap-1' : 'grid-cols-8 gap-1.5'}`}
          role="radiogroup"
          aria-label="Selecionar icone do time"
        >
          {TEAM_ICONS.map((icon) => {
            const active = team.icon === icon
            return (
              <button
                key={icon}
                type="button"
                onClick={() => updateTeam(idx, 'icon', icon)}
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                aria-label={`Icone ${icon}`}
                className={`aspect-square flex items-center justify-center text-lg rounded-xs transition-colors ${
                  active
                    ? 'bg-goscore-accent/12 border border-goscore-accent'
                    : 'bg-transparent border border-transparent hover:bg-goscore-border/50'
                }`}
              >
                {icon}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

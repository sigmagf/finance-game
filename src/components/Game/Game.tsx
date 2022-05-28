import React from 'react'
import { Button, Container, Form, Modal } from 'react-bootstrap'

import { Modals } from './Modals'
import { Income, Expenses, Profit, Savings, RangeContainer, ToSave, ToSpend, Card } from './styled'

interface FinanceGameProps {
  income: number
  expenses: number
}

interface Props {
  onSubmit: (responses: GameResponse[][]) => void
}

const phase1Stages: FinanceGameProps[] = [
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  }
]

const phase2Stages: FinanceGameProps[] = [
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 11,
    expenses: 7
  },
  {
    income: 0,
    expenses: 7
  },
  {
    income: 0,
    expenses: 7
  },
  {
    income: 0,
    expenses: 7
  }
]

export function Game({ onSubmit }: Props): JSX.Element {
  const phases: FinanceGameProps[][] = [phase1Stages, phase2Stages]

  const [chart, setChart] = React.useState<GameResponse[][]>([])
  const [phase, setPhase] = React.useState<number>(0)
  const [stages, setStages] = React.useState<FinanceGameProps[]>(phase1Stages)
  const [stage, setStage] = React.useState(-1)
  const [savings, setSavings] = React.useState(0)
  const [profit, setProfit] = React.useState(0)
  const [stageExpenses, setStageExpenses] = React.useState(0)
  const [showModal, setShowModal] = React.useState(false)

  function nextStage(_stg = stage, _stgs = stages, _svgs = savings): void {
    const stg = _stg ?? stage
    const stgs = _stgs ?? stages
    const svgs = _svgs ?? savings
    const nextStage = (_stg ?? stage) + 1

    if (stg >= 0) {
      setChart((old) => {
        console.log(phase)
        old[phase] = [
          ...(old[phase] ?? []),
          {
            income: stgs[stg].income,
            expenses: stgs[stg].expenses,
            stageExpenses,
            savings: svgs + profit - stageExpenses
          }
        ]

        return old
      })
    }

    const newSavings = svgs + (profit - stageExpenses)

    if (nextStage >= stgs.length) {
      setShowModal(true)
      setSavings(newSavings)
      setProfit(0)
      setStageExpenses(0)

      return
    }

    const nextProfit = stgs[nextStage].income > 0 ? stgs[nextStage].income - stgs[nextStage].expenses : 0

    setStage(nextStage)
    setProfit(nextProfit)
    setStageExpenses(nextProfit)

    if (stages[nextStage].income === 0) {
      setSavings(newSavings - stages[nextStage].expenses)
    } else {
      setSavings(newSavings)
    }
  }

  function nextPhase(): void {
    const nextPhase = phase + 1

    if (nextPhase < phases.length) {
      setPhase(nextPhase)
      setStages(phases[nextPhase])
      setSavings(0)
      setProfit(0)
      setStageExpenses(0)
      setChart([])
      setStage(-1)
      nextStage(-1, phases[nextPhase], 0)
    } else {
      onSubmit(chart)
    }
  }

  function showToSave(_savings: number): number {
    if (_savings + profit - stageExpenses > 0) {
      return _savings + profit - stageExpenses
    } else {
      return 0
    }
  }

  React.useEffect(() => {
    if (stages.length > 0 && stage === -1) {
      nextStage()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Modals />
      <Container>
        {stage >= 0 && stages[stage] && (
          <Card className="mt-4">
            <Card.Header>
              <Card.Title>
                Fase {phase + 1} - Período {stage + 1} de {stages.length}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Income>Ganhos no mês: R$ {stages[stage].income}</Income>
              <Expenses>Gastos no mês: R$ {stages[stage].expenses}</Expenses>
              <Savings>Poupança: R$ {savings}</Savings>
              <Profit>Após os gastos fixos e somando sua poupança você tem: R$ {savings + profit}</Profit>
              <RangeContainer>
                <ToSave>Guardar: R$ {showToSave(savings)}</ToSave>
                <Form.Range
                  min={0}
                  value={stageExpenses}
                  max={savings + profit}
                  onChange={(v) => setStageExpenses(v.target.valueAsNumber)}
                />
                <ToSpend>Gastos com qualidade de vida: R$ {stageExpenses}</ToSpend>
              </RangeContainer>
            </Card.Body>
            <Card.Footer>
              {phase < phases.length - 1 ? (
                <Button onClick={() => nextStage()}>Proximo período</Button>
              ) : (
                <Button onClick={() => nextStage()}>Concluir</Button>
              )}
            </Card.Footer>
          </Card>
        )}
      </Container>
      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title>Fim de jogo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{`Parabéns! Você conseguiu concluir todas as fases do jogo. Para continuar, clique em "Concluir"`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setShowModal(false)
              nextPhase()
            }}
          >
            Concluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

import { useCallback } from "react";
import { useCharacterGenerator } from "./hooks/character-generator";
import { Section } from "./components/Section";
import { PersonalDetail } from "./components/PersonalDetail";
import { StatDetail } from "./components/StatDetail";
import { StatusDetail } from "./components/StatusDetail";

const Container = ({ children, className }) => (
  <div className={`container mx-auto py-8 px-4 ${className}`}>{children}</div>
);

const Row = ({ children, className }) => (
  <div className={`flex ${className}`}>{children}</div>
);

const Column = ({ children, className }) => (
  <div className={`flex flex-col ${className}`}>{children}</div>
);

export const App = () => {
  const [character, regenerate] = useCharacterGenerator();

  const handleClick = useCallback(() => {
    regenerate();
  }, [regenerate]);

  return (
    <Container>
      <Column className="gap-y-3 print:max-h-dvh">
        <h1 className="text-4xl font-bold text-center">
          Mothership Character Profile
        </h1>
        <Row className="gap-3">
          {character && (
            <>
              <Column className="w-[50%] gap-y-3">
                <Section title="Personal Details">
                  <Row className="justify-between gap-3">
                    <div className="w-[40%] bg-white rounded-md print:border-1">
                      &nbsp;
                    </div>
                    <Column className="w-[60%]">
                      <PersonalDetail name="Character Name" />
                      <PersonalDetail name="Pronouns" />
                      <PersonalDetail
                        name="Class"
                        value={character.class.name}
                      />
                      <PersonalDetail
                        className="min-h-32"
                        name="Trauma Response"
                        value={character.class.trauma_response}
                      />
                      <PersonalDetail name="High Score" />
                    </Column>
                  </Row>
                </Section>
                <Section
                  title="Stats"
                  bgColor="bg-gray-300"
                  textColor="text-black"
                >
                  <Row className="justify-center">
                    <StatDetail
                      name="Strength"
                      value={character.stats.strength}
                    />
                    <StatDetail name="Speed" value={character.stats.speed} />
                    <StatDetail
                      name="Intellect"
                      value={character.stats.intellect}
                    />
                    <StatDetail name="Combat" value={character.stats.combat} />
                  </Row>
                </Section>
                <Section
                  title="Saves"
                  bgColor="bg-gray-300"
                  textColor="text-black"
                >
                  <Row className="justify-center">
                    <StatDetail name="Sanity" value={character.saves.sanity} />
                    <StatDetail name="Fear" value={character.saves.fear} />
                    <StatDetail name="Body" value={character.saves.body} />
                  </Row>
                </Section>
                <Section
                  title="Status Report"
                  bgColor="bg-white"
                  textColor="text-black"
                  border="border-3"
                >
                  <Row className="justify-center">
                    <StatusDetail
                      name="Health"
                      currentValue={character.health.current}
                      limitValue={character.health.max}
                    />
                    <StatusDetail
                      name="Wounds"
                      currentValue={character.wounds.current}
                      limitValue={character.wounds.max}
                    />
                    <StatusDetail
                      name="Stress"
                      currentValue={character.stress.current}
                      limitValue={character.stress.min}
                      limitTitle="Minimum"
                    />
                  </Row>
                  <Row className="justify-center">
                    <Column>
                      <p className="font-extrabold uppercase">Conditions</p>
                      <p className="h-16">&nbsp;</p>
                    </Column>
                  </Row>
                </Section>
              </Column>

              <Column className="w-[50%] gap-y-3">
                <Section
                  title="Skills"
                  bgColor="bg-white"
                  textColor="text-black"
                  border="border-3"
                >
                  <Column>
                    <div className="h-48">
                      {character.skills.map((skill) => (
                        <p key={skill.id}>
                          {skill.name} (+{skill.bonus})
                        </p>
                      ))}
                    </div>
                    <Column className="bg-gray-200 rounded-lg p-2 gap-y-1">
                      <p className="font-bold uppercase">Skill Training</p>
                      <Row className="gap-x-2">
                        <div className="w-[50%] bg-white rounded-md pt-6 pl-2 pb-1">
                          <p className="text-xs">In Progress</p>
                        </div>
                        <div className="w-[50%] bg-white rounded-md pt-6 pl-2 pb-1">
                          <p className="text-xs">Time Remaining</p>
                        </div>
                      </Row>
                    </Column>
                  </Column>
                </Section>
                <Section
                  title="Equipment"
                  bgColor="bg-white"
                  textColor="text-black"
                  border="border-3"
                >
                  <Column>
                    <div className="h-72">
                      {character.equipment.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                      <p>Trinket: {character.trinket}</p>
                      <p>Patch: {character.patch}</p>
                    </div>
                    <Row className="gap-x-2 px-1">
                      <Column className="w-[50%]">
                        <p className="text-xs text-center font-bold uppercase">
                          Armor Points
                        </p>
                        <div className="bg-white rounded-2xl border-2 py-1">
                          &nbsp;
                        </div>
                      </Column>
                      <Column className="w-[50%]">
                        <p className="text-xs text-center font-bold uppercase">
                          Credits
                        </p>
                        <div className="bg-white rounded-2xl border-2 py-1">
                          &nbsp;
                        </div>
                      </Column>
                    </Row>
                  </Column>
                </Section>
                <Section
                  title="Weapons"
                  bgColor="bg-white"
                  textColor="text-black"
                  border="border-3"
                  grow
                >
                  <div className="">
                    {character.weapons.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </Section>
              </Column>
            </>
          )}
        </Row>
        <div className="text-center print:hidden">
          <button
            className="bg-gray-300 px-10 py-1 rounded-lg"
            onClick={handleClick}
          >
            New
          </button>
        </div>
      </Column>
    </Container>
  );
};

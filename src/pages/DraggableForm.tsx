import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormComponents from '../components/FormComponents';
export default function DraggableForm()
{

    const [ids, setIds] = useState<string[]>([]);

    const [currentId, setCurrentId] = useState<string>('');

    useEffect(() =>
    {
        const arr: string[] = [];

        for (let i = 0; i < 30; i++)
        {
            const id = uuidv4().substring(0, 8);

            arr.push(id);
        }
        setIds([...arr]);

        setCurrentId(arr[0]);

    }, [setIds, setCurrentId]);

    return (
        <div className="draggable-form">
            <FormComponents />
            <div className='exercise-area'>
                <header>
                    456
                </header>
                <main>
                    <div>
                        {
                            ids.map(v =>
                                <p id={v} key={v} style={{ height: "90px" }}>
                                    {v}
                                </p>
                            )
                        }
                    </div>
                    <aside className='side-navi'>
                        <ul>
                            {
                                ids.map(v =>
                                    <li>
                                        <Button
                                            type={v === currentId ? 'link' : 'text'}
                                            id={v}
                                            key={v}
                                            href={`#${v}`}
                                            data-current={v === currentId}
                                            onClick={e => setCurrentId(v)}>
                                            {v}
                                        </Button>
                                    </li>
                                )
                            }
                        </ul>
                    </aside>
                </main>

            </div>
        </div>
    );
}

import { useEffect } from 'react';
import FormComponents from '../components/FormComponents';

export default function DraggableForm()
{
    useEffect(() =>
    {
    }, []);

    return (
        <div className="draggable-form">
            <FormComponents />
            <div className='exercise-area'>

            </div>
        </div>
    );
}

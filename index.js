<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fruit Slot Machine</title>
    <style>
        /* General Styles */
        body {
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            color: #fff;
            text-align: center;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        h1 {
            font-size: 2rem;
            color: #ffcc00;
            text-shadow: 2px 2px #000;
        }

        .slot-machine {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }

        .reel {
            width: 100px;
            height: 120px;
            background-color: #222;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 48px;
            color: #ffcc00;
            box-shadow: inset 0 -4px 10px rgba(255, 255, 255, 0.1), inset 0 4px 10px rgba(0, 0, 0, 0.5);
        }

        .tokens {
            font-size: 1.5rem;
            margin-top: 20px;
        }

        .result {
            font-size: 1.25rem;
            margin-top: 15px;
        }

        button {
            background-color: #ff9800;
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 18px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
        }

        button:hover {
            background-color: #f57c00;
            transform: scale(1.05);
        }

        button:disabled {
            background-color: #555555;
            cursor: not-allowed;
        }

        .symbols {
            margin-top: 30px;
            font-size: 14px;
            color: #ccc;
        }

        @media (max-width: 768px) {
          .slot-machine {
              gap: 10px; 
          }
          .reel {
              width: 80px; 
              height:auto
          }
          

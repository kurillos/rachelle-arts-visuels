<?php

namespace App\Services;

use MongoDB\Client as MongoClient;
use PDO;

class DatabaseManager
{
    /**
     * @var array instances de connexion
     */
    protected static array $instances = [];

    /**
     * @param string $name Nom de la connexion {'mysql' | 'mongodb'}
     * @return \MongoDB\Database|\PDO
     * @throws \InvaldArgumentException
     */
    public static function get(string $name): object
    {
        if (!isset(self::$instances[$name])) {
            self::$instances[$name] = self::createInstance($name);
    }
    return self::$instances[$name];
    }

    /**
     * @param stirng $name Nom de la connexion
     * @return \MongoDB\Database|\PDO
     * @throws \InvalidArgumentException
     */
    protected static function createInstance(string $name): object
    {
        switch ($name) {
            case 'mongodb':
                $config = config('database.connections.mongodb');
                $client = new MongoClient($config['dsn']);
                return $client->selectDatabase($config['database']);
            case 'mysql':
                $config = config('database.connections.mysql');
                $dsn = "mysql:host={$config['host']};dbname={$config['database']}";
                return new PDO($dsn, $config['username'], $config['password']);

            default:
                throw new \InvalidArgumentException("Connexion non supportée: {$name}");
        }
    }
}